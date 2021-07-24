import React from 'react';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({Component, ...rest}) => {
    // console.log(props.isLoggedIn)
    if (document.cookie.includes('user')) {
        return (
            <Route {...rest} render={props => (
                
                   <Component {...props} />
            )} />
        )
    } else {
        return (
        // Show the component only when the user is logged in
        // Otherwise, redirect the user to /signin page
            <Redirect to="/api/signin" /> 
        )
    }
};
export default PrivateRoute;