const express = require('express');
const middleware = require('../middleware/user.middleware.js');

const router = express.Router();

module.exports = (params = undefined) => {
  if (params) console.log(params);
  router.get('/', (req, res) => {
    res.json({
      ok: true,
      message: 'Welcome to /users api endpoint',
    });
  });

  return router;
};
