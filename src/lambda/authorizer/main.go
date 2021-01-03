package main

import (
	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

// $env:GOOS = "linux" / $env:CGO_ENABLED = "0" / $env:GOARCH = "amd64" / go build -o main main.go / build-lambda-zip.exe -o main.zip main / sam local invoke AuthorizerFunction -e ../event.json

func handler(req events.APIGatewayCustomAuthorizerRequest) {

}

func main() {
	lambda.Start(handler)
}
