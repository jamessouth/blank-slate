package utils

import (
	"github.com/gorilla/websocket"
)

// GetSliceOfMapValues loops through the map and extracts names from the struct values
func GetSliceOfMapValues(m map[*websocket.Conn]string) []string {
	var list []string
	for _, v := range m {
		list = append(list, v)
	}
	return list
}
