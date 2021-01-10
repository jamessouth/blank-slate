import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { authContext } from "../App";

export default function PrivateRoute({
  children,
  ...rest
}) {
  let auth = useContext(authContext);
  return /*#__PURE__*/React.createElement(Route, {
    rest: true,
    render: ({
      location
    }) => auth.user ? children : /*#__PURE__*/React.createElement(Redirect, {
      to: {
        pathname: "/login",
        state: {
          from: location
        }
      }
    })
  });
}
