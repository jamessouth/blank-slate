"use strict";
// const AWS = require("aws-sdk");
const ApiGatewayManagementApi = require("aws-sdk/clients/apigatewaymanagementapi");
const DynamoDB = require("aws-sdk/clients/dynamodb");

let gamesResults;
let connsResults;

exports.handler = (req, ctx, cb) => {
    req.Records.forEach(async (rec) => {
        if (rec.eventName === "INSERT") {
            const tableName = rec.eventSourceARN.split("/", 2)[1];
            const item = rec.dynamodb.NewImage;
            console.log('item: ', item);
            const apiid = process.env.CT_APIID;
            const stage = process.env.CT_STAGE;
            const endpoint = `https://${apiid}.execute-api.${rec.awsRegion}.amazonaws.com/${stage}`;

            const apigw = new ApiGatewayManagementApi({
                apiVersion: "2018-11-29",
                region: rec.AWSRegion,
                endpoint,
            });

            const dyndb = new DynamoDB({
                apiVersion: "2012-08-10",
                region: rec.AWSRegion,
            });

            const gamesParams = {
                TableName: tableName,
                IndexName: "Players",
                KeyConditionExpression: "gsi1pk = :gm",
                ExpressionAttributeValues: {
                    ":gm": {
                        S: "GAME",
                    },
                },
            };
            try {
                gamesResults = await dyndb.query(gamesParams).promise();
            } catch (err) {
                console.log("db error: ", err);
            }
            const payload = {
                data: gamesResults.Items.map(({ pk, sk, connid }) => ({
                    no: pk.S,
                    name: sk.S,
                    conn: connid.S,
                })),
                type: "games",
            };

            console.log("data: ", payload);

            if (item.pk.S.startsWith("CONN")) {
                try {
                    await apigw
                        .postToConnection({
                            ConnectionId: item.connid.S,
                            Data: JSON.stringify(payload),
                        })
                        .promise();
                } catch (err) {
                    console.log("post error: ", err);
                }
            } else if (item.pk.S.startsWith("GAME")) {
                const connsParams = {
                    TableName: tableName,
                    KeyConditionExpression: "pk = :cn",
                    ExpressionAttributeValues: {
                        ":cn": {
                            S: "CONN",
                        },
                    },
                };
                try {
                    connsResults = await dyndb.query(connsParams).promise();
                } catch (err) {
                    console.log("db error: ", err);
                }

                try {
                    connsResults.Items.forEach(async ({ sk }) => {
                        await apigw
                            .postToConnection({
                                ConnectionId: sk.S,
                                Data: JSON.stringify(payload),
                            })
                            .promise();
                    });
                } catch (err) {
                    console.log("post error: ", err);
                }
            } else {
                console.log("other: ");
            }
        } else {
            console.log("keys", rec.dynamodb.Keys);
        }

        console.log("Stream record: ", JSON.stringify(rec, null, 2));
    });
    cb(null, `Successfully processed ${req.Records.length} records.`);
};
