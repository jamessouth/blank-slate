package utils

import (
	"github.com/gorilla/websocket"
)

// GetSliceOfMapValues loops through the clients map and extracts the names
func GetSliceOfMapValues(m map[*websocket.Conn]string) []string {
	var list []string
	for _, v := range m {
		list = append(list, v)
	}
	return list
}
