package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/jamessouth/blank-slate/src/server/structs"
	"github.com/jamessouth/blank-slate/src/server/utils"
)

// UserMessage object with username and message properties
type UserMessage struct {
	Username string `json:"username"`
	Message  string `json:"message"`
}

// UserListMessage object with message property
type UserListMessage struct {
	User []string `json:"users"`
}

var clients = make(map[*websocket.Conn]*structs.Client)
var userMessageChannel = make(chan UserMessage)
var userListMessageChannel = make(chan UserListMessage)

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
	clients[ws] = &structs.Client{Name: "", Connected: true}

	for c := range clients {

		log.Println(clients[c])
	}

	for {
		var msg UserMessage
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Println("error: ", err)
			if err.Error() == "websocket: close 1001 (going away)" {
				clients[ws].Connected = false

				// sm := UserListMessage{msg.Username}
				// log.Println(sm)
				// userListMessageChannel <- sm
			}
			delete(clients, ws)
			for c := range clients {

				log.Println("99", clients[c])
			}
			break
		}
		if msg.Message == "connect" {
			clients[ws].Name = msg.Username
			sm := UserListMessage{utils.GetSliceOfMapValues(clients)}
			log.Println(sm)
			userListMessageChannel <- sm

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
