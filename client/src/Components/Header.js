import React from 'react';
import { useHistory, Link } from 'react-router-dom';

function Header (props) {
    let history = useHistory()
    if(props.isLoggedIn === true) {
        return(
            <header>
                <div className="wrap header--flex">
                    <h1 className="header--logo"><a href="/">Courses</a></h1>
                    <nav>
                        <ul className="header--signedin">
                            <li>Welcome, {props.userName}!</li>
                            <li><a href="/signout">Sign Out</a></li>
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
                            <li><a href="/signup">Sign Up</a></li>
                            <li><Link to={{ pathname: '/signin', state:{from: history.location}}} >Sign In</Link></li>
                        </ul>
                    </nav>
                </div>    
            </header>
        )
    }
}

export default Header;