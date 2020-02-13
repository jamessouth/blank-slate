package clients

import (
	"github.com/gorilla/websocket"
	p "github.com/jamessouth/blank-slate/src/server/player"
)

// Clients is a map of websocket connections to players
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

func (c Clients) updateEachPlayer(s []*websocket.Conn, n int, st string) {
	for _, v := range s {
		c[v] = c[v].UpdatePlayer(n, st)
	}
}

// ScoreAnswers calculates the players' scores each round
func (c Clients) ScoreAnswers(answers map[string][]*websocket.Conn) {
	for s, v := range answers {
		if len(s) < 2 {
			c.updateEachPlayer(v, 0, s)
		} else if len(v) > 2 {
			c.updateEachPlayer(v, 1, s)
		} else if len(v) == 2 {
			c.updateEachPlayer(v, 3, s)
		} else {
			c.updateEachPlayer(v, 0, s)
		}
	}
}
