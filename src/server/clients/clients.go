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

func (c Clients) updateEachScore(s []*websocket.Conn, n int) {
	for _, v := range s {
		c[v] = c[v].UpdatePlayerScore(n)
	}
}

// ScoreAnswers calculates the players' scores each round
func (c Clients) ScoreAnswers(answers map[string][]*websocket.Conn) {
	for s, v := range answers {
		if len(s) < 2 {
			c.updateEachScore(v, 0)
		} else if len(v) > 2 {
			c.updateEachScore(v, 1)
		} else if len(v) == 2 {
			c.updateEachScore(v, 3)
		} else {
			c.updateEachScore(v, 0)
		}
	}
}
