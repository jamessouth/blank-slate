import Amplify from "aws-amplify";
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

export const authContext = createContext();

const App = () => {
    return (
        <ProvideAuth>
            <Router>
                <div>
                    <AuthButton />

                    <ul>
                        <li>
                            <Link to="/leaderboards">Leaderboards</Link>
                        </li>
                        <li>
                            <Link to="/lobby">Enter</Link>
                        </li>
                    </ul>

                    <Switch>
                        <Route path="/leaderboards">
                            <h3>Leaderboards</h3>
                        </Route>
                        <Route path="/login">
                            <LoginPage />
                        </Route>
                        <PrivateRoute path="/lobby">
                            <h3>Games</h3>
                        </PrivateRoute>
                    </Switch>
                </div>
            </Router>
        </ProvideAuth>
    );
};

export default App;
