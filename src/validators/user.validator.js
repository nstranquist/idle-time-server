const Joi = require('joi');
const { password } = require('./custom.validator');

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

module.exports = {
  createUser,
  authenticateUser,
  resetPassword
};
