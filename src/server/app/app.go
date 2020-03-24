package app

import (
	"errors"
	"log"
	"net/http"
	"os"
	re "regexp"
	"strings"
	"time"

	"github.com/gorilla/websocket"
	c "github.com/jamessouth/clean-tablet/src/server/clients"
	"github.com/jamessouth/clean-tablet/src/server/data"
	"github.com/jamessouth/clean-tablet/src/server/game"
)

// Init kicks off the app
func Init() {
	fs := http.FileServer(http.Dir("./dist"))
	http.Handle("/", fs)
	http.HandleFunc("/ws", handleConnections)
	go handlePlayerMessages()
	port, ok := os.LookupEnv("PORT")
	if !ok {
		port = "8000"
	}
	log.Println("server running on port " + port)
	err := http.ListenAndServe(":"+port, nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}

type answer struct {
	Answer string          `json:"answer"`
	Conn   *websocket.Conn `json:"conn"`
}

type message struct {
	Answer     *string `json:"answer,omitempty"`
	GameNumber int     `json:"gamenumber,omitempty"`
	Message    string  `json:"message,omitempty"`
	Name       string  `json:"name,omitempty"`
}

func validateName(s string, r *re.Regexp) error {
	if !r.MatchString(s) {
		return errors.New("Invalid name: " + s)
	}
	return nil
}

func sanitizeMessageFactory(r *re.Regexp) func(s string) string {
	return func(s string) (a string) {
		if len(s) > 16 {
			s = s[:16]
		}
		a = r.ReplaceAllLiteralString(s, "")
		return
	}
}

type word struct {
	Word string `json:"word"`
}

type gametime struct {
	Time int `json:"time"`
}

const winningScore = 25

var (
	gameID = 0

	gameList = make(map[int]game.Game)
	// clientsMu sync.Mutex

	conns = make(map[*websocket.Conn]bool)

	messageChannel = make(chan interface{})

	upgrader = websocket.Upgrader{}

	// gameobj = game{inProgress: false}

	blockRegex = re.MustCompile(`(?i)^[a-z '-]+$`)

	sanitizeRegex = re.MustCompile(`(?i)[^a-z '-]`)

	compareRegex = re.MustCompile(`[^a-z]`)

	sanitizeMessage = sanitizeMessageFactory(sanitizeRegex)

	// colorList = stringList(data.Colors).shuffleList()

	// wordList = stringList(data.Words).shuffleList()

	// answers = make(map[string][]*websocket.Conn)

	answerChannel = make(chan answer, 1)
)

func processAnswers(s string, r *re.Regexp) (ans string) {
	a := strings.ToLower(s)
	ans = r.ReplaceAllLiteralString(a, "")
	return
}

func handleConnections(w http.ResponseWriter, r *http.Request) {
	upgrader.CheckOrigin = func(r *http.Request) bool {
		return true
	}

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer ws.Close()
	conns[ws] = true

	if len(conns)%2 == 1 {
		gameID++
		log.Println("initGame")
		gameList[gameID] = game.InitGame(data.Colors[:2], data.Words[:2], gameID)

	}

	err = ws.WriteJSON(message{GameNumber: gameID})
	if err != nil {
		log.Printf("error writing to client: %v", err)
	}

	log.Println(ws.RemoteAddr())
	log.Println(gameList)

	for {
		var msg message
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Println("msg read or ws error: ", err)
			if err.Error() == "websocket: close 1001 (going away)" {
				sock, ok := clients[ws]
				if ok {
					colorList = append(colorList, sock.Color)
				}
				delete(clients, ws)
				if len(clients) > 0 {
					messageChannel <- clients.GetPlayers()
				}
			}
			delete(clients, ws)
			if len(clients) == 0 {
				gameobj.InProgress = false
				nameList = []string{}
				colorList = stringList(data.Colors).shuffleList()
				wordList = stringList(data.Words).shuffleList()
				answers = make(map[string][]*websocket.Conn)
				numAns = 0
			}
			break
		}

		switch {
		case msg.Name != "":
			if err = validateName(msg.Name, blockRegex); err != nil {
				err := ws.WriteJSON(message{Message: "invalid"})
				if err != nil {
					log.Printf("error writing to client: %v", err)
				}
			} else {
				playerColor := gameList[msg.GameNumber].GetPlayerColor()

				gameList[msg.GameNumber].UpdateGameColorList("remove", "")

				gameList[msg.GameNumber].Clients[ws] = c.InitPlayer(msg.Name, playerColor)
				if dupe := gameList[msg.GameNumber].NameList.CheckForDuplicateName(msg.Name); dupe {
					err := ws.WriteJSON(message{Message: "duplicate"})
					if err != nil {
						log.Printf("duplicate name error: %v", err)
					}
					delete(gameList[msg.GameNumber].Clients, ws)
					gameList[msg.GameNumber].UpdateGameColorList("add", playerColor)
				} else {
					err = ws.WriteJSON(c.PlayerJSON{Player: gameList[msg.GameNumber].Clients[ws]})
					if err != nil {
						log.Printf("name ok write error: %v", err)
					}
					gameList[msg.GameNumber].AddNameToNameList(msg.Name)
					messageChannel <- gameList[msg.GameNumber].Clients.GetPlayers()
					if gameList[msg.GameNumber].InProgress {
						messageChannel <- message{Message: "progress"}
					}
				}
			}
		case msg.Message == "start":
			if !gameobj.InProgress {
				gameobj.InProgress = true
				const startDelay = 6
				sig, sig2, timerDone := make(chan bool), make(chan bool), make(chan bool)
				ticker := time.NewTicker(time.Second)
				go handleTimers(timerDone, ticker, startDelay)
				time.Sleep(startDelay * time.Second)
				ticker.Stop()
				timerDone <- true
				close(timerDone)
				go sendWords(sig, sig2)
			}
		case msg.Message == "reset":
			messageChannel <- message{Message: "reset"}
		case msg.Message == "keepAlive":
		case len(*msg.Answer) > -1:
			ans := sanitizeMessage(*msg.Answer)
			clients[ws] = clients[ws].UpdatePlayerAnswer(ans)
			answerChannel <- answer{Answer: processAnswers(ans, compareRegex), Conn: ws}
		default:
			newMsg := sanitizeMessage(msg.Message)
			log.Println("other msg: ", newMsg)
			messageChannel <- newMsg
		}
	}
}

func handleAnswers(s, s2 chan bool) {
	done := make(chan bool)
	for {
		select {
		case <-done:
			return
		case ans := <-answerChannel:
			numAns++
			answers[ans.Answer] = append(answers[ans.Answer], ans.Conn)
			if numAns == len(clients) {
				clients.ScoreAnswers(answers)
				messageChannel <- clients.GetPlayers()
				if winners := clients.GetWinners(winningScore); len(winners.Players) > 0 {
					messageChannel <- winners.FormatWinners()
					close(s2)
					s <- true
				} else {
					answers = make(map[string][]*websocket.Conn)
					numAns = 0
					time.Sleep(10 * time.Second)
					s2 <- true
				}
				return
			}
		}
	}
}

func sendWords(s, s2 chan bool) {
	for msg := range serveGame(wordList, s, s2) {
		messageChannel <- word{Word: msg}
		go handleAnswers(s, s2)
	}
	return
}

func serveGame(wl []string, s, s2 chan bool) (ch chan string) {
	ch = make(chan string)
	go func() {
		for _, w := range wl {
			select {
			case <-s:
				close(ch)
				return
			default:
				ch <- w
				<-s2
			}
		}
		close(ch)
	}()
	return
}

func handleTimers(done chan bool, tick *time.Ticker, countdown int) {
	for {
		select {
		case <-done:
			return
		case <-tick.C:
			messageChannel <- gametime{Time: countdown}
			countdown--
		}
	}
}

func handlePlayerMessages() {
	for {
		msg := <-messageChannel
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("message channel error: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}
