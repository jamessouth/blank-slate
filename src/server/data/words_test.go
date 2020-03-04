package data

import (
	"regexp"
	"testing"
)

var re = regexp.MustCompile(`^____ [a-z]{2,9}$|^[a-z]{2,9} ____$`)

func TestWords(t *testing.T) {
	loop := func(w []string) (bool, string, int) {
		for i, j := range w {
			if !re.MatchString(j) {
				return false, j, i + 5
			}
		}
		return true, "", 0
	}

	tests := map[string]struct {
		words []string
	}{
		"each word has: 4 _, 1 space, 2-9 lower-case letters, OR 2-9 lower-case letters, 1 space, 4 _": {words: Words},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			got, word, ind := loop(tc.words)
			if !got {
				t.Fatalf("the %s test failed on word: %s, line: %d", name, word, ind)
			}
		})
	}
}
