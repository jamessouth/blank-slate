package structs

// Message object with username and message properties
type Message struct {
	Username string `json:"username"`
	Message  string `json:"message"`
}

// UsersList object with message property
type UsersList struct {
	Users []string `json:"users"`
}

// Game object holds game data
type Game struct {
	Players []string `json:"players"`
}
