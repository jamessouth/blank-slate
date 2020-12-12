import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";
import {
    withAuthenticator,
    AmplifyAuthenticator,
    AmplifyFormSection,
    AmplifyAuthFields,
    AmplifySignUp,
  } from '@aws-amplify/ui-react';
  import Amplify from "aws-amplify";
  import {
    AuthState,
  } from "@aws-amplify/ui-components";

  import awsExports from "../../aws-exports";
Amplify.configure(awsExports);

export default function Auth({ handleSignIn }) {
    return (
        <AmplifyAuthenticator handleAuthStateChange={(nextAuthState, authData) => {
            if (nextAuthState === AuthState.SignedIn) {
                handleSignIn(true);
            };
            if (nextAuthState === AuthState.SignedOut) {
                handleSignIn(false);
            };
            console.log('state: ', nextAuthState, authData);
        }}/>
    );
}