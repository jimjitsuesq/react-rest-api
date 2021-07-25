'use strict';

let db = require('./models').sequelize;
const routes = require('./routes');

// load modules
const express = require('express');
const cors = require ('cors')
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// create the Express app
const app = express();
app.use(cookieParser('82e4e438a0705fabf61f9854e3b575af'));
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());



// setup morgan which gives us http request logging
app.use(morgan('dev'));

(async () => {
  try {
    await db.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.log('Error connecting to the database: ', error);
  }
})();

(async () => {
  try {
    await db.sync();
    console.log('Synced!')
  }
  catch (error) {
    console.log('Sync error!')
  }
})();

// setup a friendly greeting for the root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the REST API project!',
  });
});

app.use('/api', routes);

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
  console.error(err)
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});