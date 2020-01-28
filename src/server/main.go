package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/jamessouth/blank-slate/src/server/data"
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

	colorList = stringList(data.Colors).ShuffleList()

	wordList = stringList(data.Words).ShuffleList()

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

func (l stringList) ShuffleList() []string {
	t := time.Now().UnixNano()
	rand.Seed(t)

	rand.Shuffle(len(l), func(i, j int) {
		l[i], l[j] = l[j], l[i]
	})
	return l
}

func formatTiedWinners(s []player) string {
	if len(s) == 2 {
		return s[0].Name + " and " + s[1].Name + "!"
	}
	res := ""
	for _, p := range s[:len(s)-1] {
		res += p.Name + ", "
	}
	return res + "and " + s[len(s)-1].Name + "!"
}

func checkForWin(clients map[*websocket.Conn]player) []player {
	var res []player
	for _, p := range clients {
		log.Println(p)
		if p.Score >= 15 {
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
	log.Println("words", wordList, len(wordList))

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
				// game.Players = st.Message{Players: utils.GetPlayers(clients)}
				// log.Println("playerList: ", game.Players)
				messageChannel <- players{Players: getPlayers(clients)}

			}
			delete(clients, ws)
			if len(clients) == 0 {
				gameobj.InProgress = false
				nameList = []string{}
				colorList = stringList(data.Colors).ShuffleList()
				wordList = stringList(data.Words).ShuffleList()
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
					messageChannel <- message{Message: "in progress"}
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
				var sig = make(chan bool, 1)
				var sig2 = make(chan bool, 1)
				go sendWords(sig, sig2)
			}
			// for cnt > 0 {

			// 	go sendWord(sig, sig2)
			// 	<-sig
			// }
			// close(sig)
			// close(sig2)

		} else if *msg.Answer != interface{}(nil) {

			log.Println("ANSmsg", msg)
			answerChannel <- answer{Answer: *msg.Answer, Conn: ws}

		} else {

			log.Println("84msg", msg)

			messageChannel <- msg
		}

	}
}

func anss(s2 chan bool) {
	log.Println("anss running")
	done := make(chan bool)
	// for {
	// 	ans := <-answerChannel
	// 	sock := <-websocketChannel
	// 	log.Println("sockans", ans, sock)
	// 	log.Println("anssss", answers)

	// 		scoreRound(answers)
	// 		s2 <- true
	// 	}
	// }
	// ticker := time.NewTicker(14 * time.Second)

	for {
		select {
		case <-done:
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

				} else if len(winners) == 1 {
					messageChannel <- gamewinners{Winners: winners[0].Name}
				} else {
					answers = make(map[string][]*websocket.Conn)
					numAns = 0

					time.Sleep(2 * time.Second)
					s2 <- true
				}
			}

			// case <-ticker.C:
		}
	}
	// done <- true
	// ticker.Stop()
}

func sendWords(s chan<- bool, s2 chan bool) {
	for msg := range serveGame(wordList) {
		messageChannel <- word{Word: msg}
		// cnt--
		go anss(s2)
		// if cnt < 0 {
		// 	s <- true

		// }
		<-s2
	}

}

func serveGame(wl []string) <-chan string {
	ch := make(chan string)
	go func() {

		for _, w := range wl {
			ch <- w
			// time.Sleep(10 * time.Second)
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
	// go handleServerMessages()

	log.Println("server running on port 8000")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}

}
