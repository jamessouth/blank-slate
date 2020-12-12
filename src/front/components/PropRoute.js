import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";

export default function PropRoute({ exact, path, component, func }) {
    const Component = component;
    return (
        <Route
            exact={ exact }
            path={ path }
        >
            <Component handleSignIn={ func } />
        </Route>
    );
}