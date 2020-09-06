module.exports = {
  host: process.env.DB_HOST || 'localhost:27017',
  database: process.env.DB_NAME || 'idle-time-server',
  user: null, // for testing
  password: null, // for testing
};

// // Set up mongoose connection
// const mongoose = require('mongoose');

// const mongoDB = 'mongodb://localhost/idle_time_server';
// // const mongoDB = process.env.MONGO_DB_CONN;

// mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });
// mongoose.Promise = global.Promise;

// module.exports = mongoose;
