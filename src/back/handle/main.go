package main

import (
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

// $env:GOOS = "linux"
// $env:CGO_ENABLED = "0"
// $env:GOARCH = "amd64"
// go build -o main main.go
// build-lambda-zip.exe -o main.zip main
// sam local invoke HandleFunction -e connect.json

func handler(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	fmt.Println("reqqqq", req)

	return events.APIGatewayProxyResponse{
		Body:       fmt.Sprintf("Hell549oooo, %v", "hi"),
		StatusCode: 200,
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
	}, nil
}

func main() {
	lambda.Start(handler)
}
