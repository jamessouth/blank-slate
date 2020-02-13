package clients

import (
	"github.com/gorilla/websocket"
	p "github.com/jamessouth/blank-slate/src/server/player"
)

type Clients map[*websocket.Conn]p.Player

// GetPlayersOrWinners returns a function that returns a slice of either all players' names or the winner(s) of the game
func (c Clients) GetPlayersOrWinners(comp int) func() []p.Player {
	return func() []p.Player {
		var res []p.Player
		for _, p := range c {
			if p.Score >= comp {
				res = append(res, p)
			}
		}
		return res
	}
}
