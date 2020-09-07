import Joi from 'joi';
import { password } from './custom.validator';

const createUser = Joi.object().keys({
  name: Joi.string().required(),
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password)
});

const authenticateUser = Joi.object().keys({
  email: Joi.string().required().email(),
  password: Joi.string().required().custom(password)
});

const resetPassword = Joi.object().keys({
  email: Joi.string().required().email()
});

export {
  createUser,
  authenticateUser,
  resetPassword
};
