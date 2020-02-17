package clients

import (
	"testing"

	"github.com/google/go-cmp/cmp"
	"github.com/gorilla/websocket"
)

var (
	ws1          = &websocket.Conn{}
	ws2          = &websocket.Conn{}
	ws3          = &websocket.Conn{}
	ws4          = &websocket.Conn{}
	ws5          = &websocket.Conn{}
	oneClient    = map[*websocket.Conn]Player{ws1: Player{Answer: "", Name: "bill", Color: "#800000", Score: 1}}
	threeClients = map[*websocket.Conn]Player{ws1: Player{Answer: "", Name: "bill", Color: "#800000", Score: 25}, ws2: Player{Answer: "", Name: "sally", Color: "#80e000", Score: 1}, ws3: Player{Answer: "", Name: "walter", Color: "#80e050", Score: 1}}
	fourClients  = map[*websocket.Conn]Player{ws1: Player{Answer: "", Name: "bill", Color: "#800000", Score: 25}, ws2: Player{Answer: "", Name: "sally", Color: "#80e000", Score: 25}, ws3: Player{Answer: "", Name: "walter", Color: "#80e050", Score: 1}, ws4: Player{Answer: "", Name: "tom", Color: "#870000", Score: 1}}
	fiveClients  = map[*websocket.Conn]Player{ws1: Player{Answer: "", Name: "bill", Color: "#800000", Score: 25}, ws2: Player{Answer: "", Name: "sally", Color: "#80e000", Score: 25}, ws3: Player{Answer: "", Name: "walter", Color: "#80e050", Score: 25}, ws4: Player{Answer: "", Name: "tom", Color: "#870000", Score: 1}, ws5: Player{Answer: "", Name: "vera", Color: "#960000", Score: 1}}
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
		"three players": {cl: threeClients, want: Players{[]Player{Player{Answer: "", Name: "bill", Color: "#800000", Score: 25}, Player{Answer: "", Name: "sally", Color: "#80e000", Score: 1}, Player{Answer: "", Name: "walter", Color: "#80e050", Score: 1}}}},
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

func TestUpdatenPlayerAnswer(t *testing.T) {
	t.Skip()
	tests := map[string]struct {
		ans  string
		pl   Player
		want Player
	}{
		"was blank": {ans: "tern", pl: Player{Answer: "", Name: "bill", Color: "#800000", Score: 0}, want: Player{Answer: "tern", Name: "bill", Color: "#800000", Score: 0}},
		"replace":   {ans: "broom", pl: Player{Answer: "chair", Name: "bill", Color: "#800000", Score: 10}, want: Player{Answer: "broom", Name: "bill", Color: "#800000", Score: 10}},
		"no answer": {ans: "", pl: Player{Answer: "hat", Name: "bill", Color: "#800000", Score: 20}, want: Player{Answer: "", Name: "bill", Color: "#800000", Score: 20}},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			got := tc.pl.UpdatePlayerAnswer(tc.ans)
			diff := cmp.Diff(tc.want, got)
			if diff != "" {
				t.Fatalf(diff)
			}
		})
	}
}
