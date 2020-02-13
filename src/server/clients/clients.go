package clients

import (
	"github.com/gorilla/websocket"
	p "github.com/jamessouth/blank-slate/src/server/player"
)

const winningScore = 25

type Clients map[*websocket.Conn]p.Player

// CheckForWin checks to see if one or more players has won the game
func (c Clients) CheckForWin() []p.Player {
	var res []p.Player
	for _, p := range c {
		if p.Score >= winningScore {
			res = append(res, p)
		}
	}
	return res
}
