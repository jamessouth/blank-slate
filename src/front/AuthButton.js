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
  
  export default function AuthButton() {
    let history = useHistory();
    let auth = useContext(authContext);
  
    return auth.user ? (
      <p>
        Welcome!{" "}
        <button
          onClick={() => {
            auth.signout(() => history.push("/"));
          }}
        >
          Sign out
        </button>
      </p>
    ) : (
      <p>You are not logged in.</p>
    );
  }
  