package utils

import (
	"log"
	"math/rand"
	"time"

	"github.com/gorilla/websocket"
	"github.com/jamessouth/blank-slate/src/server/structs"
)

// GetPlayers loops through the clients map and extracts the names
func GetPlayers(m map[*websocket.Conn]structs.Player) []structs.Player {
	var list []structs.Player
	for _, v := range m {
		list = append(list, v)
	}
	return list
}

// NameCheck checks for duplicate names entered by users
func NameCheck(s string, names []string) bool {
	for _, n := range names {
		if n == s {
			return true
		}
	}
	return false
}

// PlayerColors type to hold shuffle method
type PlayerColors []string

// ShuffleColors method to provide a random mix of colors each game
func (c PlayerColors) ShuffleColors() []string {
	t := time.Now().UnixNano()
	rand.Seed(t)
	log.Println(t)

	rand.Shuffle(len(c), func(i, j int) {
		c[i], c[j] = c[j], c[i]
	})
	return c
}
