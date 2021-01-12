import React from "react";
import { Switch, Route, Link, useLocation } from "react-router-dom";
import LoginPage from "./LoginPage";
import Comp from "./Comp";
import PrivateRoute from "./PrivateRoute";

import useLocationBlocker from "../hooks/useLocationBlocker";

const ce = React.createElement;

export default function Routes() {
    //   useLocationBlocker();
    console.log("ddd: ", useLocation());
    return ce(
        Switch,
        null,
        ce(
            Route,
            {
                path: "/",
                exact: true,
            },
            ce(
                "ul",
                null,
                ce(
                    "li",
                    null,
                    ce(
                        Link,
                        {
                            to: "/leaderboards",
                        },
                        "Leaderboards"
                    )
                ),
                ce(
                    "li",
                    null,
                    ce(
                        Link,
                        {
                            to: "/lobby",
                        },
                        "Enter"
                    )
                )
            )
        ),
        ce(
            Route,
            {
                path: "/leaderboards",
            },
            ce(Comp)
        ),
        ce(
            Route,
            {
                path: "/login",
            },
            ce(LoginPage, null)
        ),
        ce(
            PrivateRoute,
            {
                path: "/lobby",
            },
            ce(
                "h3",
                null,
                "Games",
                ce(
                    Link,
                    {
                        to: "/leaderboards",
                    },
                    "Leaderboards"
                )
            )
        )
    );
}
