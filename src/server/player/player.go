package player

// Player holds info on each player: last answer, name, color, and score
type Player struct {
	Answer string `json:"answer"`
	Name   string `json:"name"`
	Color  string `json:"color"`
	Score  int    `json:"score"`
}

// UpdatePlayer takes a player and the change in their score and returns a new updated player
func (p Player) UpdatePlayerScore(n int) Player {
	newplayer := p
	newplayer.Score += n
	return newplayer
}

// UpdatePlayer takes a player and their sanitized but otherwise unprocessed answer (as they entered it) and returns a new updated player
func (p Player) UpdatePlayerAnswer(s string) Player {
	newplayer := p
	newplayer.Answer = s
	return newplayer
}
