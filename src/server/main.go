package main

import (
	"errors"
	"log"
	"math/rand"
	"net/http"
	"os"
	re "regexp"
	"strings"
	"time"

	"github.com/gorilla/websocket"
	c "github.com/jamessouth/clean-tablet/src/server/clients"
	"github.com/jamessouth/clean-tablet/src/server/data"
)

type game struct {
	InProgress bool `json:"inProgress"`
}

type answer struct {
	Answer string          `json:"answer"`
	Conn   *websocket.Conn `json:"conn"`
}

type message struct {
	Answer  *string `json:"answer,omitempty"`
	Name    string  `json:"name,omitempty"`
	Message string  `json:"message,omitempty"`
}

func validateName(s string, r *re.Regexp) error {
	if !r.MatchString(s) {
		return errors.New("Invalid name: " + s)
	}
	return nil
}

func sanitizeMessageClosure(r *re.Regexp) func(s string) string {
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
	clients = make(c.Clients)
	// clientsMu sync.Mutex

	messageChannel = make(chan interface{})

	upgrader = websocket.Upgrader{}

	gameobj = game{InProgress: false}

	nameList []string

	blockRegex = re.MustCompile(`(?i)^[a-z '-]+$`)

	sanitizeRegex = re.MustCompile(`(?i)[^a-z '-]`)

	compareRegex = re.MustCompile(`[^a-z]`)

	sanitizeMessage = sanitizeMessageClosure(sanitizeRegex)

	colorList = stringList(data.Colors).shuffleList()

	wordList = stringList(data.Words).shuffleList()

	answers = make(map[string][]*websocket.Conn)

	answerChannel = make(chan answer, 1)

	numAns = 0
)

func checkForDuplicateName(s string, names []string) bool {
	for _, n := range names {
		if n == s {
			return true
		}
	}
	return false
}

type stringList []string

func (l stringList) shuffleList() (newlist []string) {
	t := time.Now().UnixNano()
	rand.Seed(t)

	newlist = append([]string(nil), l...)

	rand.Shuffle(len(newlist), func(i, j int) {
		newlist[i], newlist[j] = newlist[j], newlist[i]
	})
	return
}

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
				playerColor, colorList := colorList[len(colorList)-1], colorList[:len(colorList)-1]
				clients[ws] = c.InitPlayer(msg.Name, playerColor)
				if dupe := checkForDuplicateName(msg.Name, nameList); dupe {
					err := ws.WriteJSON(message{Message: "duplicate"})
					if err != nil {
						log.Printf("duplicate name error: %v", err)
					}
					delete(clients, ws)
					colorList = append(colorList, playerColor)
				} else {
					err = ws.WriteJSON(c.PlayerJSON{Player: clients[ws]})
					if err != nil {
						log.Printf("name ok write error: %v", err)
					}
					nameList = append(nameList, msg.Name)
					messageChannel <- clients.GetPlayers()
					if gameobj.InProgress {
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
					time.Sleep(2 * time.Second)
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

func main() {
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
