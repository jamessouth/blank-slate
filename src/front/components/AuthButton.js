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

  return auth.user ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", null, "Welcome! " + auth.user), /*#__PURE__*/React.createElement(AmplifySignOut, {
    handleAuthStateChange: handleAuthChange
  })) : /*#__PURE__*/React.createElement("p", null, "You are not logged in.");
}
