import Amplify, {Auth} from "@aws-amplify/auth";
import awsExports from "../aws-exports";
import React, { createContext, useEffect, useState } from "react";

// import { arch, div, h1, winner } from './styles/index.css';
import {
    BrowserRouter as Router,
    Link,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";

import ProvideAuth from "./components/ProvideAuth";
import AuthButton from "./components/AuthButton";

import LoginPage from "./components/LoginPage";
import PrivateRoute from "./components/PrivateRoute";

Amplify.configure(awsExports);

export const authContext = createContext();

const App = () => {
  return /*#__PURE__*/React.createElement(ProvideAuth, null, /*#__PURE__*/React.createElement(Router, null, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(AuthButton, null), /*#__PURE__*/React.createElement("ul", null, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Link, {
    to: "/leaderboards"
  }, "Leaderboards")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement(Link, {
    to: "/lobby"
  }, "Enter"))), /*#__PURE__*/React.createElement(Switch, null, /*#__PURE__*/React.createElement(Route, {
    path: "/leaderboards"
  }, /*#__PURE__*/React.createElement("h3", null, "Leaderboards")), /*#__PURE__*/React.createElement(Route, {
    path: "/login"
  }, /*#__PURE__*/React.createElement(LoginPage, null)), /*#__PURE__*/React.createElement(PrivateRoute, {
    path: "/lobby"
  }, /*#__PURE__*/React.createElement("h3", null, "Games"))))));
};

export default App;
