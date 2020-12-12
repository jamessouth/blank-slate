import React from 'react';
import { Switch, Route, Redirect } from "react-router-dom";

export default function AuthRoute({ exact, path, component, auth, location }) {
    const Component = component;
    return (
        <Route
            exact={ exact }
            path={ path }
        >
            {auth ? <Component/> : <Redirect to={`/auth?redirect=${location.pathname}${location.search}`}/>}
        </Route>
    );
}