const express = require('express');
const middleware = require('./user.middleware.js');

const router = express.Router();

module.exports = (params) => {
  router.get('/', (req, res, next) => {
    res.json({
      ok: true,
      message: 'Welcome to /users api endpoint',
    });
  });

  return router;
};
