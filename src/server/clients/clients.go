package clients

import (
	"github.com/gorilla/websocket"
)

type PlayerJSON struct {
	Player Player `json:"player"`
}

type gamewinners struct {
	Winners string `json:"winners"`
}

// Player holds info on each player: last answer, name, color, and score
type player struct {
	Answer string `json:"answer"`
	Name   string `json:"name"`
	Color  string `json:"color"`
	Score  int    `json:"score"`
}

type players struct {
	Players []Player `json:"players"`
}

func InitPlayer(name, color string) (p player) {
	return player{Name: name, Color: color, Score: 0}
}

func (ps players) FormatWinners() (gw gamewinners) {
	plrs := ps.Players
	if len(plrs) == 1 {
		return gamewinners{Winners: plrs[0].Name}
	}
	if len(plrs) == 2 {
		return gamewinners{Winners: plrs[0].Name + " and " + plrs[1].Name}
	}

	res := ""
	for _, p := range plrs[:len(plrs)-1] {
		res += p.Name + ", "
	}
	return gamewinners{Winners: res + "and " + plrs[len(plrs)-1].Name}
}

func (p Player) updatePlayerScore(n int) (newplayer Player) {
	newplayer = p
	newplayer.Score += n
	return
}

// UpdatePlayerAnswer takes a player and their sanitized but otherwise unprocessed answer (as they entered it) and returns a new updated player
func (p Player) UpdatePlayerAnswer(s string) (newplayer Player) {
	newplayer = p
	newplayer.Answer = s
	return
}

// Clients is a map of websocket connections to players
type Clients map[*websocket.Conn]Player

// GetPlayers returns a slice of all the players' names
func (c Clients) GetPlayers() (list players) {
	for _, p := range c {
		list.Players = append(list.Players, p)
	}
	return
}

// GetWinners returns a slice of the winner(s) of the game, if any
func (c Clients) GetWinners(comp int) (list players) {
	for _, p := range c {
		if p.Score >= comp {
			list.Players = append(list.Players, p)
		}
	}
	return
}

func (c Clients) updateEachScore(s []*websocket.Conn, n int) {
	for _, v := range s {
		c[v] = c[v].updatePlayerScore(n)
	}
}

// ScoreAnswers calculates the players' scores each round
func (c Clients) ScoreAnswers(answers map[string][]*websocket.Conn) {
	for s, v := range answers {
		switch {
		case len(s) < 2:
			c.updateEachScore(v, 0)
		case len(v) > 2:
			c.updateEachScore(v, 1)
		case len(v) == 2:
			c.updateEachScore(v, 3)
		default:
			c.updateEachScore(v, 0)
		}
	}
}
