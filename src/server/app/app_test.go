package app

import (
	"regexp"
	"strings"
	"testing"
)

func errorContains(out error, want string) bool {
	if out == nil {
		return want == ""
	}
	return strings.Contains(out.Error(), want)
}

func TestValidateName(t *testing.T) {
	blockRegex = regexp.MustCompile(`(?i)^[a-z '-]+$`)

	tests := map[string]struct {
		re   *regexp.Regexp
		s    string
		want string
	}{
		"passes 1": {re: blockRegex, s: "AzaZ '-", want: ""},
		"passes 2": {re: blockRegex, s: "bill", want: ""},
		"passes 3": {re: blockRegex, s: "SALLY", want: ""},
		"fails 1":  {re: blockRegex, s: "john5", want: "Invalid name: " + "john5"},
		"fails 2":  {re: blockRegex, s: "<script>", want: "Invalid name: " + "<script>"},
		"fails 3":  {re: blockRegex, s: "() => ", want: "Invalid name: " + "() => "},
	}

	for name, tc := range tests {
		t.Run(name, func(t *testing.T) {
			got := validateName(tc.s, tc.re)
			if !errorContains(got, tc.want) {
				t.Fatal("want: ", got.Error(), "got: ", tc.want)
			}

		})
	}
}
