import React from "react";
import { authContext } from "../App";
import useAuthState from "../hooks/useAuthState";

export default function ProvideAuth({ children }) {
    const auth = useAuthState();
    return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}
