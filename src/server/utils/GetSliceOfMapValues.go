package utils

import (
	"github.com/gorilla/websocket"
	"github.com/jamessouth/blank-slate/src/server/structs"
)

// GetSliceOfMapValues loops through the map and extracts names from the struct values
func GetSliceOfMapValues(m map[*websocket.Conn]*structs.Client) []string {
	var list []string
	for _, v := range m {
		list = append(list, v.Name)
	}
	return list
}
