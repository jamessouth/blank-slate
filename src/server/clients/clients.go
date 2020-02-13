package clients

import (
	"github.com/gorilla/websocket"
	p "github.com/jamessouth/blank-slate/src/server/player"
)

const winningScore = 25

type Clients map[*websocket.Conn]p.Player

// CheckForWin returns a slice of one or more players who have won the game
func (c Clients) CheckForWin() []p.Player {
	var res []p.Player
	for _, p := range c {
		if p.Score >= winningScore {
			res = append(res, p)
		}
	}
	return res
}

// GetPlayers returns a slice containing players' names
func (c Clients) GetPlayers() []p.Player {
	var list []p.Player
	for _, v := range c {
		list = append(list, v)
	}
	return list
}
