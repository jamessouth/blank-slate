package structs

// Message object with PlayerName and Message properties
type Message struct {
	PlayerName string `json:"playerName,omitempty"`
	Message    string `json:"message,omitempty"`
	Time       int    `json:"time,omitempty"`
}

// Player object with name, score, color
type Player struct {
	Name  string `json:"name"`
	Color string `json:"color"`
	Score int    `json:"score"`
}

// PlayersList object with Players property
type PlayersList struct {
	Players []Player `json:"players"`
}

// Game object holds game data
type Game struct {
	Players    PlayersList `json:"players"`
	InProgress bool        `json:"inProgress"`
}
