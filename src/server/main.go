package main

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
)

var clients = make(map[*websocket.Conn]bool)
var broadcast = make(chan Message)

var upgrader = websocket.Upgrader{}

// Message object with username and message properties
type Message struct {
	Username string `json:"username"`
	Message  string `json:"message"`
}

func main() {
	fmt.Println("working...")
	fs := http.FileServer(http.Dir("../dist"))
	http.Handle("/", fs)
}
