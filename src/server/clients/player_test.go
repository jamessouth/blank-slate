package clients

import (
	"testing"

	"github.com/google/go-cmp/cmp"
)

func TestInitPlayer(t *testing.T) {
	tests := map[string]struct {
		name, color string
		want        Player
	}{
		"simple": {name: "bill", color: "#800000", want: Player{Answer: "", Name: "bill", Color: "#800000", Score: 0}},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			got := InitPlayer(tc.name, tc.color)
			diff := cmp.Diff(tc.want, got)
			if diff != "" {
				t.Fatalf(diff)
			}
		})
	}
}

func TestUpdatePlayerScore(t *testing.T) {
	tests := map[string]struct {
		inc  int
		pl   Player
		want Player
	}{
		"plus one":   {inc: 1, pl: Player{Answer: "", Name: "bill", Color: "#800000", Score: 0}, want: Player{Answer: "", Name: "bill", Color: "#800000", Score: 1}},
		"plus three": {inc: 3, pl: Player{Answer: "", Name: "bill", Color: "#800000", Score: 10}, want: Player{Answer: "", Name: "bill", Color: "#800000", Score: 13}},
		"plus zero":  {inc: 0, pl: Player{Answer: "", Name: "bill", Color: "#800000", Score: 20}, want: Player{Answer: "", Name: "bill", Color: "#800000", Score: 20}},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			got := tc.pl.updatePlayerScore(tc.inc)
			diff := cmp.Diff(tc.want, got)
			if diff != "" {
				t.Fatalf(diff)
			}
		})
	}
}
