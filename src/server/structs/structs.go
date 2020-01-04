package structs

// Client object with name and connection status
type Client struct {
	Name      string
}

// UserMessage object with username and message properties
type UserMessage struct {
	Username string `json:"username"`
	Message  string `json:"message"`
}

// UserListMessage object with message property
type UserListMessage struct {
	Users []string `json:"users"`
}