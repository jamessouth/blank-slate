import { useState } from "react";
import { AuthState } from "@aws-amplify/ui-components";

export default function useAuthState() {
    const [user, setUser] = useState();
    const [authState, setAuthState] = useState(AuthState.SignIn);

    return {
        authState,
        setAuthState,
        user,
        setUser,
    };
}
