import React, {
    useContext,
    //createContext,
    useState,
} from "react";
import {
    //BrowserRouter as Router,
    //Switch,
    //Route,
    //Link,
    //Redirect,
    useHistory,
    useLocation,
} from "react-router-dom";
import { authContext } from "./App";

import {
    withAuthenticator,
    AmplifyAuthenticator,
    AmplifyFormSection,
    AmplifyAuthFields,
    AmplifySignIn,
    AmplifySignUp,
  } from '@aws-amplify/ui-react';

export default function LoginPage() {
    let history = useHistory();
    let location = useLocation();
    let auth = useContext(authContext);

    let { from } = location.state || { from: { pathname: "/" } };
    // let login = () => {
    //     auth.signin(() => {
    //         history.replace(from);
    //     });
    // };


    const [authState, setAuthState] = useState();
    // const [user, setUser] = useState();
    console.log('login: ', authState);
  
    // useEffect(() => {
    //     onAuthUIStateChange((nextAuthState, authData) => {
    //         setAuthState(nextAuthState);
    //         setUser(authData);
    //     });
    // }, []);

    const handleAuthChange = (authState, userData) => {
        console.log("chgin b4", authState, userData);
        setAuthState(authState);
        auth.setUser(userData);
        console.log("chgin after", authState, userData);
        return history.replace(from);
      }


    return (
        // <div>
        //     <p>You must log in to view the page at {from.pathname}</p>
        //     <button onClick={login}>Log in</button>
        //     <AmplifySignUp/>
        // </div>
            <AmplifySignIn handleAuthStateChange={handleAuthChange}/>
    );
}
