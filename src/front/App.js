import Amplify from "aws-amplify";
import awsExports from "../aws-exports";
import React, { createContext, useEffect, useState } from 'react';
import Entry from './components/Entry';
import Lobby from './components/Lobby';
// import { arch, div, h1, winner } from './styles/index.css';
import { BrowserRouter as Router, Link, Switch, Route, Redirect } from "react-router-dom";



import ProvideAuth from "./ProvideAuth";
import AuthButton from "./AuthButton";

import LoginPage from "./LoginPage";
import PrivateRoute from "./PrivateRoute";




import {
    AuthState,
    onAuthUIStateChange,
} from "@aws-amplify/ui-components";

import {
    withAuthenticator,
    AmplifyAuthenticator,
    AmplifySignOut,
    AmplifyAuthFields,
    AmplifySignUp,
} from '@aws-amplify/ui-react';

Amplify.configure(awsExports);

export const authContext = createContext();

const App = () => {
    const [authState, setAuthState] = useState();
    const [user, setUser] = useState();
    console.log('wer: ', user, authState);
  
    useEffect(() => {
        onAuthUIStateChange((nextAuthState, authData) => {
            setAuthState(nextAuthState);
            setUser(authData);
        });
    }, []);

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
            {/* <div>
                {authState === AuthState.SignedIn && user ? `${user.username} is Logged In` : 'Not Logged In'}
            </div>
            <Switch>
                {authState === AuthState.SignedIn && user && <Redirect exact from="/" to="/lobby" />}
                {(authState === AuthState.SignedOut || !user) && <Redirect exact from="/lobby" to="/lobby" />}
                <Route exact path="/lobby">
                    <Lobby/>
                </Route>
                <Route exact path="/score">
                {() => <div>score</div>}
                </Route>
                <Redirect to="/"/>
            </Switch> */}
        </Router>
        </ProvideAuth>
    );
}

export default App;
// export default withAuthenticator(App);