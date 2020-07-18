const express = require("express");
const morganLogger = require("morgan");
const users = require("./routes/users");
const tasks = require("./routes/tasks");
const projects = require("./routes/projects");
const settings = require('./routes/settings')
const timetracking = require('./routes/timetracking')
const presets = require('./routes/presets')
const bodyParser = require("body-parser");
const cors = require('cors')
const winston = require('winston')
const mongoose = require("./config/database"); //database configuration
var jwt = require("jsonwebtoken");
require("dotenv").config();

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.on("open", () => console.log('connected to db successfully'))

const app = express();

app.use(cors())

app.set("secretKey", process.env.API_SECRET);// jwt secret token// connection to mongodb

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', "*")
//   next();
// })


app.use(morganLogger("dev"));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.json({ tutorial: "Build REST API with node.js" });
});

// public route
app.use("/auth", users);

// private route
app.use("/tasks", validateUser, tasks)

app.use("/projects", validateUser, projects)

app.use('/settings', validateUser, settings);

app.use('/timetracking', validateUser, timetracking)

app.use('/presets', validateUser, presets)

// app.get("/favicon.ico", function (req, res) {
//   res.sendStatus(200);
// });

function validateUser(req, res, next) {
  jwt.verify(req.headers["x-access-token"], req.app.get("secretKey"), function (
    err,
    decoded
  ) {
    if (err) {
      res.json({ status: "error", message: err.message, data: null });
    } else {
      // add user id to request
      req.body.userId = decoded.id;
      next();
    }
  });
}

// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function (req, res, next) {
  let err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// handle errors
app.use(function (err, req, res, next) {
  console.log(err);

  // idea: check for an attached "error" field in request, and see if can give more custom error msessage

  if (err.status === 404)
    res.status(404).json({ status: "error", message: "Resource not found" });
  else
    res.status(500).json({ status: "error", message: "Internal Error: Something looks wrong" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log(`Node server listening on port ${PORT}`);
});
