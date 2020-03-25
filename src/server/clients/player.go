package clients

// Player holds info on each player: last answer, name, color, and score
type Player struct {
	Answer string `json:"answer"`
	Name   string `json:"name"`
	Color  string `json:"color"`
	Score  int    `json:"score"`
}

// PlayerJSON adds a player key to the resulting JSON to ease parsing on the front end
type PlayerJSON struct {
	Player Player `json:"player"`
}

// Players lists all players to populate the scoreboard
type Players struct {
	Players []Player `json:"players"`
}

// InitPlayer initializes a player struct
func InitPlayer(name, color string) (p Player) {
	return Player{Name: name, Color: color, Score: 0}
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
