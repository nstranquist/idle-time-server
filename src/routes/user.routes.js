import * as validator from '../validators/user.validator';
import { validateBody } from '../middleware/validate';
import * as userController from '../controllers/user.controller';

const express = require('express');

const router = express.Router();

router.post('/login', validateBody(validator.authenticateUser), userController.authenticate);
router.post('/signup', validateBody(validator.createUser), userController.create);
router.post('/reset-password', validateBody(validator.resetPassword), userController.resetPassword);

module.exports = router;
