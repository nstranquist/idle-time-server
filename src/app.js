const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose'); // database configuration
const MongoStore = require('connect-mongo')(session);
const swaggerUi = require('swagger-ui-express');
const MongoService = require('./lib/db');
const auth = require('./lib/passport-auth');
const indexRouter = require('./routes/index');
const swaggerDoc = require('../swagger.json');
require('dotenv').config();

module.exports = (config) => {
  const { log } = config;

  MongoService.connect(config.db.connection)
    .then(() => log.info('connected to mongodb successfully'))
    .catch(err => log.fatal('mongodb connection failed with error:', err));

  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(compression());

  // sets up swagger for app under /api-docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc, { explorer: true }));

  // Define services

  // For resources
  // app.use('/', express.static(path.join(__dirname, '../public')));
  app.get('/favicon.ico', (req, res) => res.sendStatus(204));

  app.set('secretKey', config.jwtSecret); // jwt secret token // connection to mongodb

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(cookieParser());

  // Set the express session according to the development environment
  if (app.get('env') === 'production') {
    app.set('trust proxy', 'loopback'); // where 'loopback' is localhost
    app.use(
      session({
        secret: config.sessionSecret,
        name: 'sessionId', // to further hide whether this is express server or not
        proxy: true, // makes adjustments to how session management works
        cookie: { secure: true, maxAge: 60000 }, // force browser to only send secure cookies
        resave: true, // session will stay active if it wasn't changed
        saveUninitialized: false, // to prevent getting empty objects in database
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
        secure: true
      })
    );
  } else if (app.get('env') === 'development') {
    app.use(
      session({
        secret: config.sessionSecret,
        resave: true, // session will stay active if it wasn't changed
        saveUninitialized: false, // to prevent getting empty objects in database
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
      })
    );
  } else if (app.get('env') === 'test' || app.get('env') === 'testing') {
    log.info('testing db');
    app.use(
      session({
        secret: config.sessionSecret,
        saveUninitialized: false,
        resave: false
      })
    );
  } else {
    log.fatal(
      'Unknown development environment. Please specify in .env. Exiting'
    );
    process.exit(1);
  }

  app.use(auth.initialize);
  app.use(auth.session);
  app.use(auth.setUser);

  // API route handling
  app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to IdleTime. Use /v1 to access the api' });
  });

  app.use('/v1', indexRouter());

  // express doesn't consider not found 404 as an error so we need to handle 404 explicitly
  // handle 404 error
  // app.use((req, res, next) => {
  //   const err = new Error('Not Found');
  //   err.status = 404;
  //   next(err);
  // });

  // handle errors
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    // console.log('error handler:', err);

    // idea: check for an attached "error" field in request, and see if can give more custom error msessage
    // if(err.status && err.message)
    //   res.status(err.status).json({ status: "error", message: err.message})
    if (err && err.status && err.status === 404) {
      res.status(404).json({
        ok: false,
        message: 'Resource not found',
      });
    } else if (err) {
      // log('error:', err.stack);
      res.status(400).json({ ok: false, message: 'Something looks wrong', error: err.stack });
    } else {
      res.status(500).json({ ok: false, message: 'Internal Error' });
    }
  });

  return app;
};
