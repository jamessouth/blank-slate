import React from 'react';
import Login from '../Login';
import { Route } from "react-router-dom";

export default function Routes() {
   return (
        <Route exact path="/">
            <Login/>
        </Route>
    );
}