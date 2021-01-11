import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

import "./styles/index.css";
// import { arch, div, h1, winner } from './styles/index.css';

ReactDOM.render( React.createElement(React.Fragment, null, React.createElement("h1", {
  className: "text-6xl mt-11 text-center font-arch decay-mask"
}, "CLEAN TABLET"), React.createElement(App, null)), document.querySelector("#root"));
