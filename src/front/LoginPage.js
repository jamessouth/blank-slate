import React, {
    useContext,
    //createContext,
    //useState,
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
    AuthState,
    onAuthUIStateChange,
} from "@aws-amplify/ui-components";

import {
    withAuthenticator,
    AmplifyAuthenticator,
    AmplifyFormSection,
    AmplifyAuthFields,
    AmplifyConfirmSignUp,
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


    
    // const [user, setUser] = useState();
    // console.log('login: ', auth);
  
    // useEffect(() => {
    //     onAuthUIStateChange((nextAuthState, authData) => {
    //         setAuthState(nextAuthState);
    //         setUser(authData);
    //     });
    // }, []);

    const handleAuthChange = (authState, userData) => {
        console.log("login: ", authState, userData);
        auth.setAuthState(authState);
        if (authState === AuthState.SignedIn) {
            auth.setUser(userData);
        }
        // console.log("chgin after", auth);
        return history.replace(from);
      }

    // switch (auth.authState) {
    //     case AuthState.SignUp:
    //         return (
    //             <AmplifySignUp handleAuthStateChange={handleAuthChange}/>
    //         );
    //     case AuthState.SignIn:
    //         return (
    //             <AmplifySignIn handleAuthStateChange={handleAuthChange}/>
    //         );
    //     case AuthState.ConfirmSignUp:
    //         return (
    //             <AmplifyConfirmSignUp handleAuthStateChange={handleAuthChange}/>
    //         );
    // }


    return auth.authState === AuthState.SignUp ? (
        <AmplifySignUp handleAuthStateChange={handleAuthChange}/>
        ) : (
        <AmplifySignIn handleAuthStateChange={handleAuthChange}/>

    );
}
