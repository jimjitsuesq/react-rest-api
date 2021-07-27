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
   * authorization header and assigns them to the variable 'credentials'
   * If a cookie is present, it is used for authentication.  Otherwise,
   * credentials are used.
   */

  const credentials = auth(req);
  const cookie = req.signedCookies.user

  if (cookie) {
    const user = await User.findOne({ where: {emailAddress: credentials.name} });
    const authenticated = (req.signedCookies.user === user.password)
    if (authenticated) {  
      console.log(`Authentication successful for username ${user.emailAddress}`);
      req.currentUser = user;
    } else {
      message = `Authentication failure for username: ${user.emailAddress}`;
    }
  } else {
    if (credentials) {
      console.log('credentials!')
      const user = await User.findOne({ where: {emailAddress: credentials.name} });
      if (user) {
        const authenticated = bcrypt
          .compareSync(credentials.pass, user.password);
        if (authenticated) {
          console.log(`Authentication successful for username ${user.emailAddress}`);
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
  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
};