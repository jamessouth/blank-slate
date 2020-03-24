package game

import (
	"math/rand"
	"time"

	"github.com/gorilla/websocket"
	c "github.com/jamessouth/clean-tablet/src/server/clients"
)

type stringList []string

func (l stringList) shuffleList() (newlist []string) {
	t := time.Now().UnixNano()
	rand.Seed(t)

	newlist = append([]string(nil), l...)

	rand.Shuffle(len(newlist), func(i, j int) {
		newlist[i], newlist[j] = newlist[j], newlist[i]
	})
	return
}

func (l stringList) CheckForDuplicateName(s string) bool {
	for _, n := range l {
		if n == s {
			return true
		}
	}
	return false
}

// Game holds the game info: an id number, inProgress boolean, clients list, list of names, lists of colors and words, players' answers per round, and a counter of answers submitted per round
type Game struct {
	id                            int
	InProgress                    bool
	Clients                       c.Clients
	colorList, wordList, NameList stringList
	answers                       map[string][]*websocket.Conn
	numberOfAnswersReceived       int
}

// InitGame initializes a game struct
func InitGame(colors, words stringList, id int) Game {
	return Game{
		id:                      id,
		InProgress:              false,
		Clients:                 make(c.Clients),
		NameList:                stringList{},
		colorList:               stringList(colors).shuffleList(),
		wordList:                stringList(words).shuffleList(),
		answers:                 make(map[string][]*websocket.Conn),
		numberOfAnswersReceived: 0,
	}
}

// GetPlayerColor comment
func (g Game) GetPlayerColor() string {
	return g.colorList[len(g.colorList)-1]
}

func (g Game) UpdateGameColorList(action string, color string) (newgame Game) {
	newgame = g
	if action == "remove" {
		newgame.colorList = g.colorList[:len(g.colorList)-1]
	} else if action == "add" {
		newgame.colorList = append(newgame.colorList, color)
	}
	return
}

func (g Game) AddNameToNameList(name string) (newgame Game) {
	newgame = g
	newgame.NameList = append(newgame.NameList, name)
	return
}
