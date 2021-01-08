import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { authContext } from "../App";

import { AmplifySignOut } from "@aws-amplify/ui-react";

export default function AuthButton() {
    let history = useHistory();
    let auth = useContext(authContext);

    const handleAuthChange = (authState, userData) => {
        console.log("chgout b4", authState, userData);
        auth.setAuthState(authState);
        auth.setUser(userData);
        return history.push("/");
    };

    return auth.user ? (
        <>
            <p>{"Welcome! " + auth.user}</p>
            <AmplifySignOut handleAuthStateChange={handleAuthChange} />
        </>
    ) : (
        <p>You are not logged in.</p>
    );
}
