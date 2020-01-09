package utils

import (
	"github.com/gorilla/websocket"
	"log"
)

// GetSliceOfMapValues loops through the clients map and extracts the names
func GetSliceOfMapValues(m map[*websocket.Conn]string) []string {
	var list []string
	for _, v := range m {
		list = append(list, v)
	}
	return list
}

// NameCheck checks for duplicate names entered by users
func NameCheck(s string, names []string) bool {
	for _, n := range names {
		log.Println(s, n, names)

		if n == s {
			return true
		}
	}
	return false
}
