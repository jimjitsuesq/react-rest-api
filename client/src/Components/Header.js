import React, { useState } from 'react';
import { useHistory, useLocation, withRouter, Link } from 'react-router-dom';

function Header (props) {
    let history = useHistory()
    let location = useLocation()
    if(props.isLoggedIn === true) {
        return(
            <header>
                <div className="wrap header--flex">
                    <h1 className="header--logo"><a href="/">Courses</a></h1>
                    <nav>
                        <ul className="header--signedin">
                            <li>Welcome, {props.userName}!</li>
                            <li><a href="/api/signout">Sign Out</a></li>
                        </ul>
                    </nav>
                </div>    
            </header>
        )
    } else {
        return(
            <header>
                <div className="wrap header--flex">
                    <h1 className="header--logo"><a href="/">Courses</a></h1>
                    <nav>
                        <ul className="header--signedout">
                            <li><a href="/api/signup">Sign Up</a></li>
                            <li><Link to={{ pathname: '/api/signin', state:{from: history.location}}} >Sign In</Link></li>
                        </ul>
                    </nav>
                </div>    
            </header>
        )
    }
}

export default withRouter(Header);