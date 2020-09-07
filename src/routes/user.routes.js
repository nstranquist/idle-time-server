import * as validator from '../validators/user.validator';
import { validateBody } from '../middleware/validate';
import { authenticate, create, resetPassword } from '../controllers/user.controller';

const express = require('express');

const router = express.Router();

router.post('/login', validateBody(validator.authenticateUser), authenticate);
router.post('/signup', validateBody(validator.createUser), create);
router.post('/reset-password', validateBody(validator.resetPassword), resetPassword);

module.exports = router;
