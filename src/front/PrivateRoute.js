import React, {
    useContext
    //createContext,
    //useState
  } from "react";
  import {
    //BrowserRouter as Router,
    //Switch,
    Route,
    //Link,
    Redirect
    //useHistory
    //useLocation
  } from "react-router-dom";
  import { authContext } from "./App";
  
  export default function PrivateRoute({ children, ...rest }) {
    let auth = useContext(authContext);
    return (
      <Route
        {...rest}
        render={({ location }) =>
          auth.user ? (
            children
          ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
        }
      />
    );
  }
  