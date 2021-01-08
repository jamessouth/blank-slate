import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { authContext } from "../App";

const rce = React.createElement;

export default function PrivateRoute({ children, ...rest }) {
  let auth = useContext(authContext);
  return /*#__PURE__*/rce(Route, {
    ...rest,
    render: ({
      location
    }) => auth.user ? children : /*#__PURE__*/rce(Redirect, {
      to: {
        pathname: "/login",
        state: {
          from: location
        }
      }
    })
  });
}
