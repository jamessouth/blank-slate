package clients

import (
	"testing"

	"github.com/google/go-cmp/cmp"
	"github.com/gorilla/websocket"
)

var (
	ws1, ws2, ws3, ws4, ws5 = &websocket.Conn{}, &websocket.Conn{}, &websocket.Conn{}, &websocket.Conn{}, &websocket.Conn{}

	oneClient = Clients{ws1: Player{Answer: "", Name: "bill", Color: "#800000", Score: 1}}

	threeClients = Clients{ws1: Player{Answer: "", Name: "bill", Color: "#800000", Score: 25}, ws2: Player{Answer: "", Name: "sally", Color: "#80e000", Score: 1}, ws3: Player{Answer: "", Name: "walter", Color: "#80e050", Score: 2}}
)

func TestFormatWinners(t *testing.T) {
	onePlayer := Players{[]Player{Player{Answer: "", Name: "bill", Color: "#800000", Score: 1}}}
	twoPlayers := Players{[]Player{Player{Answer: "", Name: "bill", Color: "#800000", Score: 1}, Player{Answer: "", Name: "sally", Color: "#80e000", Score: 1}}}
	threePlayers := Players{[]Player{Player{Answer: "", Name: "bill", Color: "#800000", Score: 1}, Player{Answer: "", Name: "sally", Color: "#80e000", Score: 1}, Player{Answer: "", Name: "walter", Color: "#80e050", Score: 1}}}

	tests := map[string]struct {
		pls  Players
		want Gamewinners
	}{
		"one winner":    {pls: onePlayer, want: Gamewinners{Winners: "bill"}},
		"two winners":   {pls: twoPlayers, want: Gamewinners{Winners: "bill and sally"}},
		"three winners": {pls: threePlayers, want: Gamewinners{Winners: "bill, sally, and walter"}},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			got := tc.pls.FormatWinners()
			diff := cmp.Diff(tc.want, got)
			if diff != "" {
				t.Fatalf(diff)
			}
		})
	}
}

func TestGetPlayers(t *testing.T) {
	tests := map[string]struct {
		cl   Clients
		want Players
	}{
		"no players":    {cl: Clients{}, want: Players{}},
		"one player":    {cl: oneClient, want: Players{[]Player{Player{Answer: "", Name: "bill", Color: "#800000", Score: 1}}}},
		"three players": {cl: threeClients, want: Players{[]Player{Player{Answer: "", Name: "bill", Color: "#800000", Score: 25}, Player{Answer: "", Name: "sally", Color: "#80e000", Score: 1}, Player{Answer: "", Name: "walter", Color: "#80e050", Score: 2}}}},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			got := tc.cl.GetPlayers()
			diff := cmp.Diff(tc.want, got)
			if diff != "" {
				t.Fatalf(diff)
			}
		})
	}
}

func TestGetWinners(t *testing.T) {
	fourClients := Clients{ws1: Player{Answer: "", Name: "bill", Color: "#800000", Score: 25}, ws2: Player{Answer: "", Name: "sally", Color: "#80e000", Score: 25}, ws3: Player{Answer: "", Name: "walter", Color: "#80e050", Score: 1}, ws4: Player{Answer: "", Name: "tom", Color: "#870000", Score: 1}}
	fiveClients := Clients{ws1: Player{Answer: "", Name: "bill", Color: "#800000", Score: 25}, ws2: Player{Answer: "", Name: "sally", Color: "#80e000", Score: 25}, ws3: Player{Answer: "", Name: "walter", Color: "#80e050", Score: 25}, ws4: Player{Answer: "", Name: "tom", Color: "#870000", Score: 1}, ws5: Player{Answer: "", Name: "vera", Color: "#960000", Score: 1}}

	tests := map[string]struct {
		cl   Clients
		want Players
	}{
		"no winner":     {cl: oneClient, want: Players{}},
		"one winner":    {cl: threeClients, want: Players{[]Player{Player{Answer: "", Name: "bill", Color: "#800000", Score: 25}}}},
		"two winners":   {cl: fourClients, want: Players{[]Player{Player{Answer: "", Name: "bill", Color: "#800000", Score: 25}, Player{Answer: "", Name: "sally", Color: "#80e000", Score: 25}}}},
		"three winners": {cl: fiveClients, want: Players{[]Player{Player{Answer: "", Name: "bill", Color: "#800000", Score: 25}, Player{Answer: "", Name: "sally", Color: "#80e000", Score: 25}, Player{Answer: "", Name: "walter", Color: "#80e050", Score: 25}}}},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			got := tc.cl.GetWinners(25)
			diff := cmp.Diff(tc.want, got)
			if diff != "" {
				t.Fatalf(diff)
			}
		})
	}
}

func TestScoreAnswers(t *testing.T) {
	threeClients2 := Clients{ws1: Player{Answer: "", Name: "bill", Color: "#800000", Score: 2}, ws2: Player{Answer: "", Name: "sally", Color: "#80e000", Score: 1}, ws3: Player{Answer: "", Name: "walter", Color: "#80e050", Score: 1}}
	threeClients3 := Clients{ws1: Player{Answer: "", Name: "bill", Color: "#800000", Score: 2}, ws2: Player{Answer: "", Name: "sally", Color: "#80e000", Score: 1}, ws3: Player{Answer: "", Name: "walter", Color: "#80e050", Score: 1}}
	moreThanTwo := Clients{ws1: Player{Answer: "", Name: "bill", Color: "#800000", Score: 3}, ws2: Player{Answer: "", Name: "sally", Color: "#80e000", Score: 2}, ws3: Player{Answer: "", Name: "walter", Color: "#80e050", Score: 2}}
	exactlyTwo := Clients{ws1: Player{Answer: "", Name: "bill", Color: "#800000", Score: 5}, ws2: Player{Answer: "", Name: "sally", Color: "#80e000", Score: 4}, ws3: Player{Answer: "", Name: "walter", Color: "#80e050", Score: 1}}

	tests := map[string]struct {
		cl   Clients
		ans  map[string][]*websocket.Conn
		want Clients
	}{
		"one-letter answer":            {cl: threeClients, ans: map[string][]*websocket.Conn{"a": {ws1}, "b": {ws2, ws3}}, want: threeClients},
		"more than 2 of same answer":   {cl: threeClients2, ans: map[string][]*websocket.Conn{"all": {ws1, ws2, ws3}}, want: moreThanTwo},
		"exactly 2 of same answer":     {cl: threeClients3, ans: map[string][]*websocket.Conn{"all": {ws1, ws2}, "red": {ws3}}, want: exactlyTwo},
		"each player answers uniquely": {cl: threeClients, ans: map[string][]*websocket.Conn{"all": {ws1}, "saw": {ws2}, "red": {ws3}}, want: threeClients},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			tc.cl.ScoreAnswers(tc.ans)
			diff := cmp.Diff(tc.want, tc.cl)
			if diff != "" {
				t.Fatalf(diff)
			}
		})
	}
}
