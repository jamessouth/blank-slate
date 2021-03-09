import React, { useEffect, useState } from "react";


const ce = React.createElement;


export default function GamesList({games, send}) {
    // const [connectedWS, setConnectedWS] = useState(false);
    // const [games, setGames] = useState(null);
    // const [startedNewGame, setStartedNewGame] = useState(false);
    // const [token, setToken] = useState("");
    // const [wsError, setWSError] = useState();
    
// console.log('gamesss: ', Array.isArray(games));
    // useEffect(() => {

    // }, []);

    // useEffect(() => {

    // }, []);

    return ce(
        "ul",
        {
            className: "m-auto w-10/12"
        },
        games.map(g => ce(
            "li",
            {
                key: g.no,
                className: "mb-8",
            },
            ce(
                "button",
                {
                    className: "w-full h-full",
                    onClick: () => {
                        send({
                            action: "lobby",
                            game: `${g.no}`,
                          });
                    },
                },
                ce(
                    "p",
                    {
                        className: "text-xs"
                    },
                    `${g.no}`
                ),
                g.players.map(s => ce(
                    "p",
                    {
                        key: s,
                        // className: "mb-8",
                    },
                    s.split("#", 1)[0]
                ))
            )
        ))
    );
}

