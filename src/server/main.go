package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
)

var clients = make(map[*websocket.Conn]bool)
var userMessageChannel = make(chan UserMessage)
var serverMessageChannel = make(chan ServerMessage)

var upgrader = websocket.Upgrader{}

// UserMessage object with username and message properties
type UserMessage struct {
	Username string `json:"username"`
	Message  string `json:"message"`
}

// ServerMessage object with message properties
type ServerMessage struct {
	Message string `json:"message"`
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
	clients[ws] = true

	log.Println(clients)

	for {
		var msg UserMessage
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Println("error: ", err)
			delete(clients, ws)
			break
		}
		if msg.Message == "connect" {
			log.Println("56", msg)
			sm := ServerMessage{msg.Username}
			log.Println(sm)
			serverMessageChannel <- sm

		}
		// userMessageChannel <- msg

	}
}

func handleMessages() {
	for {
		smsg := <-serverMessageChannel
		// umsg := <-userMessageChannel
		log.Println("2", smsg)
		for client := range clients {
			// err := client.WriteJSON(umsg)
			serr := client.WriteJSON(smsg)
			if serr != nil {
				// log.Printf("error: %v", err)
				log.Printf("error: %v", serr)
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

	go handleMessages()

	log.Println("server running on port 8000")
	err := http.ListenAndServe(":8000", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
