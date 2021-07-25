'use strict';

const auth = require('basic-auth');
const { User } = require('../models');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

/**
 * Middleware to authenticate the request using Basic Authentication.
 * @param {Request} req - The Express Request object.
 * @param {Response} res - The Express Response object.
 * @param {Function} next - The function to call to pass execution to the next middleware.
 */
exports.authenticateUser = async (req, res, next) => {
  let message;
  
  /**
   * Uses the basic-auth module to parse a user's credentials from the
   * authorization header and assign them to the variable 'credentials'
   */

  const credentials = auth(req);
  const cookie = req.signedCookies.user
  console.log(credentials)
  if (cookie) {
    const user = await User.findOne({ where: {emailAddress: credentials.name} });
    const authenticated = (req.signedCookies.user === user.password)
    if (authenticated) {  
      console.log(`Authentication successful for username ${user.emailAddress}`);
      // Store the user on the Request object.
      req.currentUser = user;
    } else {
      message = `Authentication failure for username: ${user.emailAddress}`;
    }
  } else {
    if (credentials) {
      const user = await User.findOne({ where: {emailAddress: credentials.name} });
      // console.log(user)
      // console.log(credentials.name)
      // console.log(credentials.pass)
      // console.log(user.password)
      // console.log(req.signedCookies.user === user.password)
      if (user) {
        const authenticated = bcrypt
          .compareSync(credentials.pass, user.password);
        if (authenticated) {
          console.log(`Authentication successful for username ${user.emailAddress}`);
          // Store the user on the Request object.
          req.currentUser = user;
        } else {
          message = `Authentication failure for username: ${user.emailAddress}`;
        }
      } else {
        message = `User not found for username: ${credentials.emailAddress}`;
      }
    } else {
      message = 'Auth header not found';
    }
  }

  /* if (credentials) {
    const user = await User.findOne({ where: {emailAddress: credentials.name} });
    console.log(user)
    console.log(credentials.name)
    console.log(credentials.pass)
    console.log(user.password)
    console.log(req.cookies.user === user.password)
    if (user) {
      const authenticated = bcrypt
        .compareSync(credentials.pass, user.password);
        console.log(authenticated)
      if (authenticated) {
        console.log(`Authentication successful for username ${user.emailAddress}`);
        // Store the user on the Request object.
        req.currentUser = user;
      } else {
        message = `Authentication failure for username: ${user.emailAddress}`;
      }
    } else {
      message = `User not found for username: ${credentials.emailAddress}`;
    }
  } else {
    message = 'Auth header not found';
  } */

  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
};