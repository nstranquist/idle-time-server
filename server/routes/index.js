const express = require('express');

const router = express.Router();

// Require the index file
const tasksRouter = require('./tasks');
const presetsRouter = require('./presets');
const projectsRouter = require('./projects');
const settingsRouter = require('./settings');
const timetrackingRouter = require('./timetracking');
const usersRouter = require('./users');

module.exports = (params) => {
  console.log('params:', params);
  router.get('/', async (req, res) => res.status(200).json({
    message: 'Welcome to Idle Time!',
  }));

  router.use('/tasks', tasksRouter());
  router.use('/presets', presetsRouter());
  router.use('/projects', projectsRouter());
  router.use('/auth', usersRouter());
  router.use('/settings', settingsRouter());
  router.use('/timetracking', timetrackingRouter());
  return router;
};
