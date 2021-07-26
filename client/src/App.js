import React, { useState, useEffect } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import axios from 'axios';

import Courses from './Components/CourseComponents/Courses';
import Header from './Components/Header';
import UserSignUp from './Components/UserComponents/UserSignUp';
import UserSignIn from './Components/UserComponents/UserSignIn';
import UserSignOut from './Components/UserComponents/UserSignOut';
import CreateCourse from './Components/CourseComponents/CreateCourse';
import UpdateCourse from './Components/CourseComponents/UpdateCourse';
import PrivateRoute from './Components/RouteComponents/PrivateRoute';
import CourseDetail from './Components/CourseComponents/CourseDetail';
import NotFound from './Components/ErrorComponents/NotFound';
import Forbidden from './Components/ErrorComponents/Forbidden';
import UnhandledError from './Components/ErrorComponents/UnhandledError';

axios.defaults.withCredentials = true;

function App(props) {
  const [userData, setUserData] = useState('');
  const [userId, setUserId] = useState();
  const [userName, setUserName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [validationErrors, setValidationErrors] = useState([])
  const [error500Status, setError500Status] = useState(false)
  let history = useHistory()
  
  async function SignIn (props) {
    try {
        const response = await axios.get('http://localhost:5000/api/users', {
            auth: {
                username: emailAddress,
                password: password
            }
        })
        const responseJSON = JSON.stringify(response.data.authenticatedUser)
        localStorage.setItem('userInfo', responseJSON)
        const loggedInUser = localStorage.getItem('userInfo')
        const foundUser = JSON.parse(loggedInUser);
        setUserData(foundUser);
        setUserId(foundUser.id);
        setUserName(foundUser.firstName + ' ' + foundUser.lastName);
        setEmailAddress(foundUser.emailAddress);
        setPassword(response.data.authenticatedUser.password)
        console.log('User Signed In')
        setIsLoggedIn(true)
        history.push(props)
    } catch (error) {
      if (error.response.status === 500) {
            setError500Status(true)
            console.log(error500Status)
        } else {
          if (error.response.status === 400) {
                setValidationErrors(error.response.data.errors) 
                console.log(validationErrors)
            } else {
                console.log(error);
            }
        }
    }
  }

  useEffect(() => {
    const loggedInUser = localStorage.getItem('userInfo')
      if(loggedInUser) {
        const foundUser = JSON.parse(loggedInUser);
        setUserData(foundUser);
        setUserId(foundUser.id);
        setUserName(foundUser.firstName + ' ' + foundUser.lastName);
        setEmailAddress(foundUser.emailAddress);
        setPassword(userData.password)
        setIsLoggedIn(true)
      }    
  }, [userData.password])
  
  return (
    <>
      <Header isLoggedIn={isLoggedIn} userName={userName} />
        <main>
            <Switch>
              <Route 
                exact path="/" 
                render={(props) => <Courses />} 
              />
              <PrivateRoute 
                path="/courses/create" 
                props={{isLoggedIn:isLoggedIn, userData:userData}} 
                component={CreateCourse} 
              />
              <PrivateRoute 
                path="/courses/:id/update" 
                props={{isLoggedIn:isLoggedIn, userData:userData}} 
                component={UpdateCourse} 
              />
              <Route 
                path="/courses/:id"  
                render={(props) =>  <CourseDetail 
                                      isLoggedIn={isLoggedIn} 
                                      userId={userId}
                                      userData={userData}
                                    />
                } 
              />
              <Route 
                path="/signup" 
                component={UserSignUp} 
              />
              <Route 
                path="/signin" 
                render={(props) =>  <UserSignIn 
                                      emailAddress={emailAddress} 
                                      password={password} 
                                      setEmailAddress={setEmailAddress} 
                                      setPassword={setPassword} 
                                      setIsLoggedIn={setIsLoggedIn} 
                                      userData={userData} 
                                      setUserData={setUserData} 
                                      onSubmit={SignIn}
                                    />
                } 
              />
              <Route 
                path="/signout" 
                component={UserSignOut} 
              />
              <Route 
                path="/forbidden" 
                component={Forbidden} 
              />
              <Route 
                path="/error" 
                component={UnhandledError} 
              />
              <Route>
                <NotFound 
                  path="/notfound" 
                  component={NotFound}
                />
              </Route>
            </Switch>
        </main>
    </>
  );
}

export default App;
