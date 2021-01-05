import Amplify from "aws-amplify";
import awsExports from "../aws-exports";
import React, { useEffect, useState } from 'react';
import Entry from './components/Entry';
import Lobby from './components/Lobby';
// import { arch, div, h1, winner } from './styles/index.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";

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
        <Router>
            <div>
                {authState === AuthState.SignedIn && user ? `${user.username} is Logged In` : 'Not Logged In'}
            </div>
            <Switch>
                <Redirect exact from="/" to="/lobby" />
                <Route exact path="/lobby">
                    <Lobby/>
                </Route>
                <Route exact path="/score">
                {() => <div>score</div>}
                </Route>
                <Redirect to="/"/>
            </Switch>
        </Router>
    );
}

// export default App;
export default withAuthenticator(App);