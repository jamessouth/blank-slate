package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/jamessouth/blank-slate/src/server/structs"
	"github.com/jamessouth/blank-slate/src/server/utils"
)


var clients = make(map[*websocket.Conn]string)
var userMessageChannel = make(chan structs.UserMessage)
var userListMessageChannel = make(chan structs.UserListMessage)

var upgrader = websocket.Upgrader{}

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
	clients[ws] = ""

	for c := range clients {

		log.Println(clients[c])
	}

	for {
		var msg structs.UserMessage
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Println("error: ", err)
			if err.Error() == "websocket: close 1001 (going away)" {
				delete(clients, ws)
				playerList := structs.UserListMessage{Users: utils.GetSliceOfMapValues(clients)}
				log.Println(playerList)
				userListMessageChannel <- playerList

			}
			for c := range clients {

				log.Println("99", clients[c])
			}
			break
		}
		if msg.Message == "connect" {
			clients[ws] = msg.Username
			playerList := structs.UserListMessage{Users: utils.GetSliceOfMapValues(clients)}
			log.Println(playerList)
			userListMessageChannel <- playerList

		} else {
			log.Println(msg)

			userMessageChannel <- msg
		}

	}
}

func handleUserMessages() {
	for {
		msg := <-userMessageChannel
		log.Println("21", msg)
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("error: %v", err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

func handleServerMessages() {
	for {
		msg := <-userListMessageChannel
		log.Println("24", msg)
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				log.Printf("error: %v", err)
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

	go handleUserMessages()
	go handleServerMessages()

	log.Println("server running on port 8000")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
