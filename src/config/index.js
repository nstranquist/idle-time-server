require('dotenv').config();
const bunyan = require('bunyan');
const path = require('path');

const loggers = {
  development: () => bunyan.createLogger({ name: 'development', level: 'debug' }),
  production: () => bunyan.createLogger({ name: 'production', level: 'info' }),
  test: () => bunyan.createLogger({ name: 'test', level: 'fatal' }),
};

module.exports = {
  port: process.env.PORT || 8080,
  development: {
    logger: loggers.development,
    data: {
      presets: path.join(__dirname, './data/presets.json'), // in development
    },
    mongodb: {
      connection: process.env.DB_DEVELOPMENT,
    },
  },
  production: {
    logger: loggers.production,
    mongodb: {
      connection: process.env.DB_PRODUCTION,
    },
  },
  test: {
    logger: loggers.test,
    mongodb: {
      connection: process.env.DB_TEST,
    },
  },
};
