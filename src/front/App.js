import React, { useEffect, useState } from 'react';
import Entry from './components/Entry';
import Lobby from './components/Lobby';
import AuthRoute from './components/AuthRoute';
import PropRoute from './components/PropRoute';
import Auth from './components/Auth';
import { arch, div, h1, winner } from './styles/index.css';
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import {
    withAuthenticator,
    AmplifyAuthenticator,
    AmplifySignOut,
    AmplifyAuthFields,
    AmplifySignUp,
  } from '@aws-amplify/ui-react';

export default function App() {
    const [signedIn, setSignedIn] = useState(false);
    return (
        <Router>
            <AmplifySignOut/>
            <h1 className={[arch, h1].join(' ')} >CLEAN TABLET</h1>
            <div>
            {signedIn ? 'User is Logged In' : 'Not Logged In'}
            </div>
            <Switch>
                <Route exact path="/">
                    <Entry/>
                </Route>


                <PropRoute
                    exact
                    path="/auth"
                    component={ Auth }
                    func={ setSignedIn }
                />

                <AuthRoute
                    exact
                    path="/lobby"
                    component={ Lobby }
                    auth={ signedIn }
                />
                    
                
                
            </Switch>
        </Router>
       
    );
}