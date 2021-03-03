import React, { useEffect, useState } from "react";
import GamesList from "./GamesList";
import { Auth } from "@aws-amplify/auth";

const ce = React.createElement;
let ws;

export default function Lobby() {
    const [connectedWS, setConnectedWS] = useState(false);
    const [games, setGames] = useState(null);
    const [startedNewGame, setStartedNewGame] = useState(false);
    const [token, setToken] = useState("");
    const [wsError, setWSError] = useState();
    console.log("lobbbbbbbb ", connectedWS, wsError, token[0]);

    useEffect(() => {
        async function getToken() {
            const user = await Auth.currentUserPoolUser();
            const {
                signInUserSession: {
                    accessToken: { jwtToken },
                },
            } = user;
            // console.log("nnnn: ", jwtToken);
            setToken(jwtToken);
        }
        getToken();
    }, []);

    useEffect(() => {
        if (token) {
            ws = new WebSocket(`wss://${process.env.CT_APIID}.execute-api.${process.env.CT_REGION}.amazonaws.com/${process.env.CT_STAGE}?auth=${token}`);
            console.log("pojoihuh", token[0]);

            ws.addEventListener(
                "open",
                function (e) {
                    setConnectedWS(true);
                    console.log(e, Date.now());
                },
                false
            );//note: remove listeners????

            ws.addEventListener(
                "error",
                function (e) {
                    // setConnectedWS(false);
                    // console.log('eeee: ', e);
                    setWSError(e);
                    console.log(e, Date.now());
                },
                false
            );
            ws.addEventListener(
                "message",
                function (e) {
                    const {
                        type,
                        data
                        // players,
                        // time,
                        // winners,
                        // word
                    } = JSON.parse(e.data);

                    console.log("mmmm", type, data);

                    switch (type) {
                        case "games":
                            setGames(data);
                            break;
                        default:
                            console.log('no case found: ', data);
                    }
                },
                false
            );

            ws.addEventListener(
                "close",
                function (e) {
                    // setConnectedWS(false);
                    // setError(false);
                    console.log(e, Date.now());
                },
                false
            );
            return function cleanup() {
                console.log("cleanup");
                setConnectedWS(false);
                setWSError(null);
                setToken("");
                ws.close(1000);
            };
        }
    }, [token]);

    function send(text) {
        // if (!hasJoined) {
        //   ws.send(JSON.stringify({
        //     name: text,
        //   }));
        // } else {
        //   setAnswered(true);
        //   setSubmitSignal(false);
        //   setShowSVGTimer(false);
          ws.send(JSON.stringify({
            action: text,
          }));
        // }
      }

    return wsError
        ? ce("p", null, "not connected: connection error")
        : !connectedWS || !games
        ? ce(
            "p",
            null,
            "loading games..."
        )
        : ce(
            "div",
            {
                className: "flex flex-col mt-8",
            },
            !startedNewGame
            ? ce(
                "button",
                {
                    className:
                        "mx-auto mb-8 h-40 w-1/2 bg-smoke-100 text-gray-700",
                    type: "button",
                    onClick: () => {
                        setStartedNewGame(true);
                        send("lobby");
                    },
                },
                "start a new game"
            )
            : null,
            games.length < 1
            ? ce(
                "p",
                null,
                "no games found. start a new one!"
            )
            : ce(
                GamesList,
                {games}
            )
        );
}