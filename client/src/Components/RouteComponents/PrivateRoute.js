import React from 'react';
import { Route, Redirect, useHistory, useLocation } from 'react-router-dom';

const PrivateRoute = ({component: Component, props, ...rest}) => {
    let history = useHistory()
    let location = useLocation()
    let lastLocation = history.location
    if (document.cookie.includes('user')) {
        return (
            <Route {...rest}>
                <Component {...props}/>
            </Route>
        )
    } else {
        return (
        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
            <Redirect to={{ pathname: '/api/signin', state: {from: history.location} }} /> 
        )
    }
}

export default PrivateRoute;