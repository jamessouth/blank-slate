package main

import (
	"fmt"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/awserr"
	"github.com/aws/aws-sdk-go/aws/request"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
)

// $env:GOOS = "linux"
// $env:CGO_ENABLED = "0"
// $env:GOARCH = "amd64"
// go build -o main main.go
// build-lambda-zip.exe -o main.zip main
// sam local invoke HandleFunction -e connect.json

var sess *session.Session

func init() {
	sess, err := session.NewSession()
	if err != nil {
		fmt.Println("session init error")
	}
	logger := aws.NewDefaultLogger()

	sess.Handlers.Send.PushFront(func(r *request.Request) {
		logger.Log(fmt.Sprintf("Request: %s /%v, Payload: %s",
			r.ClientInfo.ServiceName, r.Operation, r.Params))
	})
}

func handler(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {

	// fmt.Println("reqqqq", req)

	svc := dynamodb.New(sess, aws.NewConfig().WithEndpoint("http://192.168.0.101:8000").WithLogLevel(aws.LogDebugWithHTTPBody))

	// svc.Handlers.Send.PushFront(func(r *request.Request) {
	// 	r.HTTPRequest.Header.Set("CustomHeader", fmt.Sprintf("%d", 10))
	// })

	op, err := svc.ListTables(&dynamodb.ListTablesInput{})
	fmt.Println(op)
	if err != nil {
		if aerr, ok := err.(awserr.Error); ok {
			switch aerr.Code() {
			case dynamodb.ErrCodeInternalServerError:
				fmt.Println(dynamodb.ErrCodeInternalServerError, aerr.Error())
			default:
				fmt.Println(aerr.Error())
			}
		} else {
			// Print the error, cast err to awserr.Error to get the Code and
			// Message from an error.
			fmt.Println(err.Error())
		}
		// return
	}

	return events.APIGatewayProxyResponse{
		Body:       fmt.Sprintf("tables: , %v", &op.TableNames[0]),
		StatusCode: 200,
		Headers: map[string]string{
			"Content-Type": "application/json",
		},
	}, nil
}

func main() {
	lambda.Start(handler)
}
