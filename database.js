//Set up mongoose connection
const mongoose = require("mongoose");
// const mongoDB = "mongodb://localhost/idle_time_server";
const mongoDB = process.env.MONGO_DB_CONN;

mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false });
mongoose.Promise = global.Promise;

module.exports = mongoose;
