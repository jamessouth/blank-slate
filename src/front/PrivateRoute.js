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

  import {
    AuthState,
    onAuthUIStateChange,
} from "@aws-amplify/ui-components";
  
  export default function PrivateRoute({ children, ...rest }) {
    let auth = useContext(authContext);
    return (
      <Route
        {...rest}
        render={({ location }) =>
          auth.user && auth.authState === AuthState.SignedIn ? (
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
  