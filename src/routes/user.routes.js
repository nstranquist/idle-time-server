const express = require('express');
const validator = require('../validators/user.validator');
const { validateBody } = require('../middleware/validate');
const userController = require('../controllers/user.controller');

const router = express.Router();

router.post('/login', validateBody(validator.authenticateUser), userController.authenticate);
router.post('/signup', validateBody(validator.createUser), userController.create);
router.post('/reset-password', validateBody(validator.resetPassword), userController.resetPassword);

module.exports = router;
