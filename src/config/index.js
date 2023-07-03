require('dotenv').config();
const bunyan = require('bunyan');
const path = require('path');

module.exports = () => {
  const nodeEnv = process.env.NODE_ENV;
  console.log({ nodeEnv });

  let environmentOptions = {};

  switch (nodeEnv) {
    case 'production':
      environmentOptions = {
        log: bunyan.createLogger({ name: 'production', level: 'info' }),
        db: {
          connection: process.env.DB_PRODUCTION,
        },
      };
      break;
    case 'development':
      environmentOptions = {
        log: bunyan.createLogger({ name: 'development', level: 'debug' }),
        db: {
          connection: process.env.DB_DEVELOPMENT,
        },
      };
      break;
    case 'test':
    case 'testing':
      environmentOptions = {
        log: bunyan.createLogger({ name: 'test', level: 'fatal' }),
        db: {
          connection: process.env.DB_TEST,
        },
      };
      break;
    default:
      environmentOptions = {
        log: bunyan.createLogger({ name: 'development', level: 'debug' }),
        db: {
          connection: process.env.DB_DEVELOPMENT,
        },
      };
      break;
  }

  return {
    ...environmentOptions, // logger, db
    port: process.env.PORT || 8080,
    data: {
      presets: path.join(__dirname, './data/presets.json'), // in development
    },
    jwtSecret: process.env.API_SECRET,
    sessionSecret: process.env.SESSION_SECRET,
  };
};
