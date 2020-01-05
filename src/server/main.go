package main

import (
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/websocket"
	"github.com/jamessouth/blank-slate/src/server/structs"
	"github.com/jamessouth/blank-slate/src/server/utils"
)

var (
	clients = make(map[*websocket.Conn]string)

	messageChannel     = make(chan structs.Message)
	playersListChannel = make(chan structs.PlayersList)
	timerDone          = make(chan bool)

	upgrader = websocket.Upgrader{}

	game                = structs.Game{InProgress: false}
	ticker *time.Ticker = new(time.Ticker)
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
	log.Println("game", game.Players)
	for c := range clients {

		log.Println("43ws conn: ", clients[c])
	}

	for {
		var msg structs.Message
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Println("50error: ", err)
			if err.Error() == "websocket: close 1001 (going away)" {
				delete(clients, ws)
				game.Players = structs.PlayersList{Players: utils.GetSliceOfMapValues(clients)}
				log.Println("playerList: ", game.Players)
				playersListChannel <- game.Players

			}
			delete(clients, ws)
			for c := range clients {

				log.Println("61", clients[c])
			}
			break
		}
		if msg.Message == "connect" {
			clients[ws] = msg.PlayerName
			log.Println("67", clients)
			game.Players = structs.PlayersList{Players: utils.GetSliceOfMapValues(clients)}
			log.Println("68", game.Players)
			playersListChannel <- game.Players
			if game.InProgress {
				messageChannel <- structs.Message{PlayerName: "", Message: "game in progress"}
			}

		} else if msg.Message == "start" {

			if !game.InProgress {
				game.InProgress = true

			}
			messageChannel <- structs.Message{PlayerName: "", Message: "remove start button"}

			ticker = time.NewTicker(time.Second)

			go func() {
				for {
					select {
					case <-timerDone:
						log.Println("done")
						return
					case t := <-ticker.C:
						messageChannel <- structs.Message{PlayerName: "", Message: t.Format("5")}
					}
				}
			}()

			time.Sleep(20 * time.Second)
			ticker.Stop()
			timerDone <- true

		} else {

			log.Println("84msg", msg)

			messageChannel <- msg
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

func handleServerMessages() {
	for {
		msg := <-playersListChannel
		log.Println("110no of clients: ", len(clients), len(playersListChannel))
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("114error: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

func main() {
	fmt.Println("working...")
	fs := http.FileServer(http.Dir("../dist"))
	http.Handle("/", fs)

	http.HandleFunc("/ws", handleConnections)

	go handlePlayerMessages()
	go handleServerMessages()

	log.Println("server running on port 8000")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}

}
