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
    withAuthenticator,
    AmplifyAuthenticator,
    AmplifySignOut,
    AmplifyAuthFields,
    AmplifySignUp,
} from '@aws-amplify/ui-react';
  
  export default function AuthButton() {
    let history = useHistory();
    let auth = useContext(authContext);
    console.log('jjjj: ', auth);

    const handleAuthChange = (authState, userData) => {
        console.log("chgout b4", authState, userData);
        // setAuthState(authState);
        auth.setUser(userData);
        console.log("chgout after", authState, userData);
        return history.push("/");
      }
  
    return auth.user ? (
      <p>
        Welcome!{" "}
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
  