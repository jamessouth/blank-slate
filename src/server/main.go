package main

import (
	"errors"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	re "regexp"
	"runtime"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/jamessouth/blank-slate/src/server/data"
)

// "watchFileChanges": true,
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

func stripAnswer(s string, r *re.Regexp) string {
	return r.ReplaceAllLiteralString(s, "")
}

type player struct {
	Answer string `json:"answer"`
	Name   string `json:"name"`
	Color  string `json:"color"`
	Score  int    `json:"score"`
}

type playerJSON struct {
	Player player `json:"player"`
}

type players struct {
	Players []player `json:"players"`
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

var (
	clients   = make(map[*websocket.Conn]player)
	clientsMu sync.Mutex

	messageChannel = make(chan interface{})
	// playersListChannel = make(chan st.PlayersList)

	upgrader = websocket.Upgrader{}

	gameobj = game{InProgress: false}

	nameList []string

	nameRegex = re.MustCompile(`(?i)^[a-z0-8 '-]+$`)

	answerRegex = re.MustCompile(`(?i)[^a-z0-8 '-]+`)

	colorList = stringList(data.Colors).shuffleList()

	wordList = stringList(data.Words).shuffleList()

	answers = make(map[string][]*websocket.Conn)

	answerChannel = make(chan answer, 1)

	numAns = 0
)

func nameCheck(s string, names []string) bool {
	for _, n := range names {
		if n == s {
			return true
		}
	}
	return false
}

type stringList []string

func (l stringList) shuffleList() []string {
	t := time.Now().UnixNano()
	rand.Seed(t)

	rand.Shuffle(len(l), func(i, j int) {
		l[i], l[j] = l[j], l[i]
	})
	return l
}

func formatTiedWinners(s []player) string {
	if len(s) == 2 {
		return s[0].Name + " and " + s[1].Name
	}
	res := ""
	for _, p := range s[:len(s)-1] {
		res += p.Name + ", "
	}
	return res + "and " + s[len(s)-1].Name
}

func checkForWin(clients map[*websocket.Conn]player) []player {
	var res []player
	for _, p := range clients {
		log.Println(p)
		if p.Score >= 9 {
			res = append(res, p)
		}
	}
	return res
}

func getPlayers(m map[*websocket.Conn]player) []player {
	var list []player
	for _, v := range m {
		list = append(list, v)
	}
	return list
}

func (p player) updatePlayer(n int, s string) player {
	log.Println("s         ", s)
	p.Score += n
	p.Answer = s
	return p
}

func forEach(s []*websocket.Conn, clients map[*websocket.Conn]player, n int, st string) {
	for _, v := range s {
		clients[v] = clients[v].updatePlayer(n, st)
	}
}

func scoreAnswers(answers map[string][]*websocket.Conn, clients map[*websocket.Conn]player) {
	for s, v := range answers {
		log.Println("ans    ", v)
		if s == "" {
			forEach(v, clients, 0, s)
		} else if len(v) > 2 {
			forEach(v, clients, 1, s)
		} else if len(v) == 2 {
			forEach(v, clients, 3, s)
		} else {
			forEach(v, clients, 0, s)
		}
	}
}

func handleConnections(w http.ResponseWriter, r *http.Request) {

	upgrader.CheckOrigin = func(r *http.Request) bool {
		origin, ok := r.Header["Origin"]
		if ok && origin[0] == "http://localhost:4200" {
			return true
		}
		return false
	}

	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer ws.Close()
	// clients[ws] = ""
	// log.Println("game", game.Players)
	// for c := range clients {

	// 	log.Println("43ws conn: ", clients[c])
	// }

	// log.Println("colors", colorList, len(colorList))
	log.Println("words", wordList, len(wordList), runtime.NumGoroutine())

	for {
		var msg message
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Println("50error: ", err)
			if err.Error() == "websocket: close 1001 (going away)" {

				sock, ok := clients[ws]
				if ok {
					log.Println("ccccc in clients map")
					colorList = append(colorList, sock.Color)
				} else {
					log.Println("ggggggg not in map")
				}

				delete(clients, ws)
				log.Println()
				log.Println()
				log.Println("GOOOOOODBYEEEE", runtime.NumGoroutine())
				// pprof.Lookup("goroutine").WriteTo(os.Stdout, 1)
				log.Println()
				log.Println()
				// game.Players = st.Message{Players: utils.GetPlayers(clients)}
				// log.Println("playerList: ", game.Players)
				messageChannel <- players{Players: getPlayers(clients)}

			}
			delete(clients, ws)
			if len(clients) == 0 {
				gameobj.InProgress = false
				nameList = []string{}
				colorList = stringList(data.Colors).shuffleList()
				wordList = stringList(data.Words).shuffleList()
				answers = make(map[string][]*websocket.Conn)
				numAns = 0
				// err
			}
			for c := range clients {

				log.Println("61", clients[c])
			}
			break
		}

		log.Println("MSG  ", msg)
		log.Println("answerlength", msg.Answer)
		fmt.Printf("%+v\n", msg)

		if msg.Name != "" {
			if err = validateName(msg.Name, nameRegex); err != nil {
				log.Println("invalid", err)
				err := ws.WriteJSON(message{Message: "invalid"})
				if err != nil {
					log.Printf("error writing to client: %v", err)
				}
			} else {

				var playerColor string
				playerColor, colorList = colorList[len(colorList)-1], colorList[:len(colorList)-1]

				clients[ws] = player{Name: msg.Name, Color: playerColor, Score: 0}
				dupe := nameCheck(msg.Name, nameList)

				if dupe {
					err := ws.WriteJSON(message{Message: "duplicate"})
					if err != nil {
						log.Printf("99error: %v", err)
						// delete(clients, client)
					}
					// ws.Close()
					delete(clients, ws)
					colorList = append(colorList, playerColor)
					// break
				} else {

					err = ws.WriteJSON(playerJSON{player{Name: msg.Name, Color: playerColor}})
					if err != nil {
						log.Printf("n111error: %v", err)
						// delete(clients, client)
					}

					nameList = append(nameList, msg.Name)

					log.Println("67", clients)
					// game.Players = st.PlayersList{Players: utils.GetPlayers(clients)}
					// log.Println("68", game.Players)

					// playersListChannel <- game.Players

					// pList, err := json.Marshal(game.Players)
					// if err != nil {
					// 	log.Printf("n111error: %v", err)
					// 	// delete(clients, client)
					// }

					messageChannel <- players{Players: getPlayers(clients)}

					if gameobj.InProgress {
						messageChannel <- message{Message: "progress"}
					}
				}
			}
		} else if msg.Message == "start" {

			if !gameobj.InProgress {
				gameobj.InProgress = true

				const startDelay = 6

				timerDone := make(chan bool)
				ticker := time.NewTicker(time.Second)

				go handleTimers(timerDone, ticker, startDelay)

				time.Sleep(startDelay * time.Second)
				ticker.Stop()
				timerDone <- true
				close(timerDone)

				log.Println("ready")
				var sig = make(chan bool)
				var sig2 = make(chan bool)
				go sendWords(sig, sig2)
			}

		} else if msg.Message == "reset" {
			messageChannel <- message{Message: "reset"}

		} else if len(*msg.Answer) > -1 {

			log.Println("ANSmsg", msg)
			answerChannel <- answer{Answer: stripAnswer(*msg.Answer, answerRegex), Conn: ws}

		} else {

			log.Println("other msg", msg)

			messageChannel <- msg
		}

	}
}

func anss(s chan bool, s2 chan bool) {

	log.Println("AAAAAAAAAanss running", runtime.NumGoroutine())
	// pprof.Lookup("goroutine").WriteTo(os.Stdout, 1)

	done := make(chan bool)

	for {
		select {
		case <-done:
			log.Println("done222222", time.Now())
			return
		case ans := <-answerChannel:
			numAns++
			answers[ans.Answer] = append(answers[ans.Answer], ans.Conn)
			log.Println("num", numAns, ans, answers)
			if numAns == len(clients) {
				scoreAnswers(answers, clients)
				messageChannel <- players{Players: getPlayers(clients)}

				if winners := checkForWin(clients); len(winners) > 1 {
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
					log.Println("sss", time.Now())
					s2 <- true
				}
				log.Println("done", time.Now())
				return
			}
			// case <-ticker.C:
		}
	}
	// done <- true
	// ticker.Stop()
}

func sendWords(s chan bool, s2 chan bool) {
	log.Println("SSSSSENDW", runtime.NumGoroutine())
	for msg := range serveGame(wordList, s, s2) {

		messageChannel <- word{Word: msg}
		go anss(s, s2)

	}
	log.Println("REACH HERERERERERE")
	// if <-s {
	return
	// }
}

func serveGame(wl []string, s, s2 chan bool) <-chan string {
	log.Println("SEEEEEEERVEG", runtime.NumGoroutine())
	ch := make(chan string)
	go func() {
		for _, w := range wl {

			select {
			case <-s:
				log.Println("SSSSSS MESSAGE", s)
				close(ch)
				return
			default:

				log.Println("SSSIIIZZZEEE", w)
				ch <- w
				<-s2
			}

		}
		close(ch)
	}()
	return ch
}

func handleTimers(done chan bool, tick *time.Ticker, countdown int) {

	for {
		log.Println(time.Now(), countdown)
		select {
		case <-done:
			log.Println("done")
			return
		case <-tick.C:
			// log.Println(time.Now(), countdown)
			messageChannel <- gametime{Time: countdown}
			countdown--
		}
	}
}

func handlePlayerMessages() {

	for {
		msg := <-messageChannel
		log.Println("95", msg, len(messageChannel))
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("99error: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

// func handleServerMessages() {
// 	for {
// 		msg := <-playersListChannel
// 		log.Println("110no of clients: ", len(clients), len(playersListChannel))
// 		for client := range clients {
// 			err := client.WriteJSON(msg)
// 			if err != nil {
// 				log.Printf("114error: %v", err)
// 				client.Close()
// 				delete(clients, client)
// 			}
// 		}
// 	}
// }

func main() {
	fmt.Println("working...")
	fs := http.FileServer(http.Dir("../dist"))
	http.Handle("/", fs)

	http.HandleFunc("/ws", handleConnections)

	go handlePlayerMessages()

	log.Println("server running on port 8000")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
