const express = require('express');

const router = express.Router();
const userController = require('../controllers/users');
// const userController = require('../controllers/user.controller');

router.post('/login', userController.authenticate);
router.post('/signup', userController.create);
router.post('/reset-password', userController.resetPassword);

module.exports = router;
