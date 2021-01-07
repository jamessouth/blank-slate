import React, {
    useContext
    //createContext,
    //useState
  } from "react";
  import {
    //BrowserRouter as Router,
    //Switch,
    //Route,
    //Link,
    //Redirect,
    useHistory
    //useLocation
  } from "react-router-dom";
  import { authContext } from "./App";

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
  
  export default function AuthButton() {
    let history = useHistory();
    let auth = useContext(authContext);
    // console.log('logout: ', auth);

    const handleAuthChange = (authState, userData) => {
        console.log("chgout b4", authState, userData);
        auth.setAuthState(authState);
        auth.setUser(userData);
        // console.log("chgout after", auth);
        return history.push("/");
      }
  
    return auth.user && auth.authState === AuthState.SignedIn ? (
      <p>
        Welcome!{auth.user}
        {/* <button
          onClick={() => {
            auth.signout(() => history.push("/"));
          }}
        >
          Sign out
        </button> */}
        <AmplifySignOut handleAuthStateChange={handleAuthChange}/>
      </p>
    ) : (
      <p>You are not logged in.</p>
    );
  }
  