const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose'); // database configuration
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const auth = require('./lib/auth');
const router = require('./routes/index');
// const users = require('./routes/users');
// const tasks = require('./routes/tasks');
// const projects = require('./routes/projects');
// const settings = require('./routes/settings');
// const timetracking = require('./routes/timetracking');
// const presets = require('./routes/presets');
require('dotenv').config();

module.exports = (config) => {
  const { logger } = config;

  const app = express();
  app.use(cors());
  app.use(helmet());
  app.use(compression());

  // define services as needed

  app.use('/', express.static(path.join(__dirname, '../public')));
  app.get('/favicon.ico', (req, res) => res.sendStatus(204));

  app.set('secretKey', process.env.API_SECRET);// jwt secret token// connection to mongodb

  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', "*")
  //   next();
  // })

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.use(cookieParser());

  // Set the express session according to the development environment
  if (app.get('env') === 'production') {
    app.set('trust proxy', 'loopback'); // where 'loopback' is localhost
    app.use(session({
      secret: 'another secret 12345',
      name: 'sessionId', // to further hide whether this is express server or not
      proxy: true, // makes adjustments to how session management works
      cookie: { secure: true }, // force browser to only send secure cookies
      resave: true, // session will stay active if it wasn't changed
      saveUninitialized: false, // to prevent getting empty objects in database
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    }));
  } else if (app.get('env') === 'development' || app.get('env') === 'test') {
    app.use(session({
      secret: 'secret 12345',
      resave: true, // session will stay active if it wasn't changed
      saveUninitialized: false, // to prevent getting empty objects in database
      store: new MongoStore({ mongooseConnection: mongoose.connection }),
    }));
  } else {
    logger.fatal('Unknown development environment. Please specify in .env. Exiting');
    process.exit(1);
  }

  app.use(auth.initialize);
  app.use(auth.session);
  app.use(auth.setUser);

  // API
  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to idletime. Sign in for more' });
  });

  // base api route
  const params = { hello: 'world' /* services */ };
  app.use('/api', router(params));

  // express doesn't consider not found 404 as an error so we need to handle 404 explicitly
  // handle 404 error
  app.use((req, res, next) => {
    console.log('throwing new, unfound error');
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // handle errors
  app.use((err, req, res) => {
  // console.log('error handler:', err);

    // idea: check for an attached "error" field in request, and see if can give more custom error msessage
    // if(err.status && err.message)
    //   res.status(err.status).json({ status: "error", message: err.message})
    if (err.status === 404) {
      res.status(404).json({
        status: 'error', message: 'Resource not found',
      });
    } else {
      res.status(500).json({ status: 'error', message: 'Internal Error: Something looks wrong' });
    }
  });

  return app;
};