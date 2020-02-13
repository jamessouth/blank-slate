package player

// import ()

// Player holds info on each player
type Player struct {
	Answer string `json:"answer"`
	Name   string `json:"name"`
	Color  string `json:"color"`
	Score  int    `json:"score"`
}

// UpdatePlayer takes a player, the change in their score, and their last answer and returns a new updated player
func (p Player) UpdatePlayer(n int, s string) Player {
	newplayer := p
	newplayer.Score += n
	newplayer.Answer = s
	return newplayer
}
