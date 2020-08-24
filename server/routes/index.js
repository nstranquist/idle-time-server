const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

// const validateUser = require('../lib/validateUser')

// Require the index file
const usersRouter = require('./users');
const tasksRouter = require('./tasks');
const presetsRouter = require('./presets');
const projectsRouter = require('./projects');
const settingsRouter = require('./settings');
const timetrackingRouter = require('./timetracking');

const validateUser = (req, res, next) => {
  jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), (
    err,
    decoded,
  ) => {
    if (err) {
      return res.json({ status: 'error', message: err.message, data: null });
    }
    // add user id to request
    req.body.userId = decoded.id;
    return next();
  });
};

module.exports = (params) => {
  console.log('params:', params);
  router.get('/', async (req, res) => res.status(200).json({
    message: 'Welcome to Idle Time!',
  }));

  router.use('/auth', usersRouter);
  router.use('/tasks', validateUser, tasksRouter);
  router.use('/presets', validateUser, presetsRouter);
  router.use('/projects', validateUser, projectsRouter);
  router.use('/settings', validateUser, settingsRouter);
  router.use('/timetracking', validateUser, timetrackingRouter);

  return router;
};

// Old, from app.js:
/*
app.use('/auth', users);

// private route
app.use('/tasks', validateUser, tasks);

app.use('/projects', validateUser, projects);

app.use('/settings', validateUser, settings);

app.use('/timetracking', validateUser, timetracking);

app.use('/presets', validateUser, presets);
*/
