package main

import (
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
	"github.com/jamessouth/blank-slate/src/server/data"
	st "github.com/jamessouth/blank-slate/src/server/structs"
	"github.com/jamessouth/blank-slate/src/server/utils"
)

var (
	clients   = make(map[*websocket.Conn]st.Player)
	clientsMu sync.Mutex

	messageChannel = make(chan st.Message)
	// playersListChannel = make(chan st.PlayersList)

	upgrader = websocket.Upgrader{}

	game = st.Game{InProgress: false}

	nameList []string

	colorList = utils.StringList(data.Colors).ShuffleList()

	wordList = utils.StringList(data.Words).ShuffleList()
)

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

	log.Println("colors", colorList, len(colorList))
	log.Println("words", wordList, len(wordList))

	for {
		var msg st.Message
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
				messageChannel <- st.Message{Players: utils.GetPlayers(clients)}

			}
			delete(clients, ws)
			if len(clients) == 0 {
				game.InProgress = false
				nameList = []string{}
				colorList = utils.StringList(data.Colors).ShuffleList()
				wordList = utils.StringList(data.Words).ShuffleList()
				// err
			}
			for c := range clients {

				log.Println("61", clients[c])
			}
			break
		}
		if msg.Name != "" {
			var color string
			color, colorList = colorList[len(colorList)-1], colorList[:len(colorList)-1]

			clients[ws] = st.Player{Name: msg.Name, Color: color, Score: 0}
			dupe := utils.NameCheck(msg.Name, nameList)

			if dupe {
				err := ws.WriteJSON(st.Message{Message: "duplicate"})
				if err != nil {
					log.Printf("99error: %v", err)
					// delete(clients, client)
				}
				// ws.Close()
				delete(clients, ws)
				colorList = append(colorList, color)
				// break
			} else {

				err := ws.WriteJSON(st.Message{Color: color})
				if err != nil {
					log.Printf("c111error: %v", err)
					// delete(clients, client)
				}

				err = ws.WriteJSON(st.Message{Name: msg.Name})
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

				messageChannel <- st.Message{Players: utils.GetPlayers(clients)}

				if game.InProgress {
					messageChannel <- st.Message{Message: "in progress"}
				}
			}

		} else if msg.Message == "start" {
			const startDelay = 6

			if !game.InProgress {
				game.InProgress = true

			}

			timerDone := make(chan bool)
			ticker := time.NewTicker(time.Second)

			go handleTimers(timerDone, ticker, startDelay)

			time.Sleep(startDelay * time.Second)
			ticker.Stop()
			timerDone <- true
			close(timerDone)

			log.Println("ready")
			serveGame(wordList)

		} else {

			log.Println("84msg", msg)

			messageChannel <- msg
		}

	}
}

func serveGame(wl []string) {

	for _, w := range wl {
		messageChannel <- st.Message{Word: w}
		time.Sleep(50 * time.Second)
	}

}

func handleTimers(done chan bool, tick *time.Ticker, countdown int) {
	log.Println(time.Now(), countdown)
	for {
		select {
		case <-done:
			log.Println("done")
			return
		case <-tick.C:
			// log.Println(time.Now(), countdown)
			messageChannel <- st.Message{Time: countdown}
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
