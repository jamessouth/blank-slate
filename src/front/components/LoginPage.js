import React, { useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { authContext } from "../App";
import { AuthState } from "@aws-amplify/ui-components";

import {
    withAuthenticator,
    AmplifyAuthenticator,
    AmplifyFormSection,
    AmplifyForgotPassword,
    AmplifyConfirmSignUp,
    AmplifySignIn,
    AmplifySignUp,
} from "@aws-amplify/ui-react";

export default function LoginPage() {
  let history = useHistory();
  let location = useLocation();
  let auth = useContext(authContext);
  let {
    from
  } = location.state || {
    from: {
      pathname: "/"
    }
  };

  const handleAuthChange = (authState, userData) => {
    console.log("login: ", authState, userData);
    auth.setAuthState(authState);

    if (authState === AuthState.SignedIn) {
      auth.setUser(userData.username);
    }

    return history.replace(from);
  };

  switch (auth.authState) {
    case AuthState.SignUp:
      return /*#__PURE__*/React.createElement(AmplifySignUp, {
        handleAuthStateChange: handleAuthChange
      });

    case AuthState.ConfirmSignUp:
      return /*#__PURE__*/React.createElement(AmplifyConfirmSignUp, {
        handleAuthStateChange: handleAuthChange
      });

    case AuthState.ForgotPassword:
      return /*#__PURE__*/React.createElement(AmplifyForgotPassword, {
        handleAuthStateChange: handleAuthChange
      });

    default:
      return /*#__PURE__*/React.createElement(AmplifySignIn, {
        handleAuthStateChange: handleAuthChange
      });
  }
}
