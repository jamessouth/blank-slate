import Amplify, { Auth } from "@aws-amplify/auth";
import awsExports from "../aws-exports";
import React, { createContext, useEffect, useState } from "react";

// import { arch, div, h1, winner } from './styles/index.css';
import {
    BrowserRouter as Router,
    Link,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";

import ProvideAuth from "./components/ProvideAuth";
import AuthButton from "./components/AuthButton";

import LoginPage from "./components/LoginPage";
import PrivateRoute from "./components/PrivateRoute";

Amplify.configure(awsExports);

const ce = React.createElement;

export const authContext = createContext();

const App = () => {
    return ce(
        ProvideAuth,
        null,
        ce(
            Router,
            null,
            ce(
                "div",
                null,
                ce(AuthButton, null),
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
                ),
                ce(
                    Switch,
                    null,
                    ce(
                        Route,
                        {
                            path: "/leaderboards",
                        },
                        ce("h3", null, "Leaderboards")
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
                        ce("h3", null, "Games")
                    )
                )
            )
        )
    );
};

export default App;
