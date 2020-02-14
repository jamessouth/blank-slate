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
	c "github.com/jamessouth/blank-slate/src/server/clients"
	"github.com/jamessouth/blank-slate/src/server/data"
	p "github.com/jamessouth/blank-slate/src/server/player"
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

type playerJSON struct {
	Player p.Player `json:"player"`
}

type players struct {
	Players []p.Player `json:"players"`
}

type gamewinners struct {
	Winners string `json:"winners"`
}

type word struct {
	Word string `json:"word"`
}

type gametime struct {
	Time int `json:"time"`
}

const (
	winningScore = 25
	playerComp   = -1
)

var (
	clientsMap = make(c.Clients)
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

func formatTiedWinners(s []p.Player) (res string) {
	if len(s) == 2 {
		return s[0].Name + " and " + s[1].Name
	}

	for _, p := range s[:len(s)-1] {
		res += p.Name + ", "
	}
	return res + "and " + s[len(s)-1].Name
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
				sock, ok := clientsMap[ws]
				if ok {
					colorList = append(colorList, sock.Color)
				}
				delete(clientsMap, ws)
				messageChannel <- players{Players: clientsMap.GetPlayersOrWinners(playerComp)()}
			}
			delete(clientsMap, ws)
			if len(clientsMap) == 0 {
				gameobj.InProgress = false
				nameList = []string{}
				colorList = stringList(data.Colors).shuffleList()
				wordList = stringList(data.Words).shuffleList()
				answers = make(map[string][]*websocket.Conn)
				numAns = 0
			}
			break
		}

		if msg.Name != "" {
			if err = validateName(msg.Name, blockRegex); err != nil {
				err := ws.WriteJSON(message{Message: "invalid"})
				if err != nil {
					log.Printf("error writing to client: %v", err)
				}
			} else {
				var playerColor string
				playerColor, colorList = colorList[len(colorList)-1], colorList[:len(colorList)-1]
				clientsMap[ws] = p.Player{Name: msg.Name, Color: playerColor, Score: 0}
				if dupe := checkForDuplicateName(msg.Name, nameList); dupe {
					err := ws.WriteJSON(message{Message: "duplicate"})
					if err != nil {
						log.Printf("duplicate name error: %v", err)
					}
					delete(clientsMap, ws)
					colorList = append(colorList, playerColor)
				} else {
					err = ws.WriteJSON(playerJSON{p.Player{Name: msg.Name, Color: playerColor}})
					if err != nil {
						log.Printf("name ok write error: %v", err)
					}
					nameList = append(nameList, msg.Name)
					messageChannel <- players{Players: clientsMap.GetPlayersOrWinners(playerComp)()}
					if gameobj.InProgress {
						messageChannel <- message{Message: "progress"}
					}
				}
			}
		} else if msg.Message == "start" {
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
		} else if msg.Message == "reset" {
			messageChannel <- message{Message: "reset"}
		} else if msg.Message == "keepAlive" {
		} else if len(*msg.Answer) > -1 {
			ans := sanitizeMessage(*msg.Answer)
			clientsMap[ws] = clientsMap[ws].UpdatePlayerAnswer(ans)
			answerChannel <- answer{Answer: processAnswers(ans, compareRegex), Conn: ws}
		} else {
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
			if numAns == len(clientsMap) {
				clientsMap.ScoreAnswers(answers)
				messageChannel <- players{Players: clientsMap.GetPlayersOrWinners(playerComp)()}
				if winners := clientsMap.GetPlayersOrWinners(winningScore)(); len(winners) > 1 {
					messageChannel <- gamewinners{Winners: formatTiedWinners(winners)}
					close(s2)
					s <- true
				} else if len(winners) == 1 {
					messageChannel <- gamewinners{Winners: winners[0].Name}
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
		for client := range clientsMap {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("message channel error: %v", err)
				client.Close()
				delete(clientsMap, client)
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
