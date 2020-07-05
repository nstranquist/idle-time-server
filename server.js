const express = require("express");
const logger = require("morgan");
const movies = require("./routes/movies");
const users = require("./routes/users");
const bodyParser = require("body-parser");
const cors = require('cors')
const mongoose = require("./config/database"); //database configuration
var jwt = require("jsonwebtoken");
require("dotenv").config();

// const corsOptions = {
//   origin: "http://localhost:3000"
// }

const app = express();

app.use(cors())

app.set("secretKey", process.env.API_SECRET);// jwt secret token// connection to mongodb

mongoose.connection.on(
  "error",
  console.error.bind(console, "MongoDB connection error:")
);

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', "*")
//   next();
// })


app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.json({ tutorial: "Build REST API with node.js" });
});

// public route
app.use("/auth", users);

// private route
app.use("/movies", validateUser, movies);

app.get("/favicon.ico", function (req, res) {
  res.sendStatus(204);
});

function validateUser(req, res, next) {
  jwt.verify(req.headers["x-access-token"], req.app.get("secretKey"), function (
    err,
    decoded
  ) {
    if (err) {
      res.status(400).json({ type: "error", message: err.message, data: null });
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
  err.type = "error";
  next(err);
});

// handle errors
app.use(function (err, req, res, next) {
  console.log(err);

  if (err.status === 404)
    res.status(404).json({ type: "error", message: "Not found" });
  else
    res.status(500).json({ type: "error", message: "Something looks wrong :(" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, function () {
  console.log(`Node server listening on port ${PORT}`);
});
