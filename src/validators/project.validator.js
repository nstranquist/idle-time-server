const Joi = require('joi');

const createProject = Joi.object().keys({
  userId: Joi.string(),
  title: Joi.string().required(),
  desc: Joi.string(),
  // add other options here
});

module.exports = {
  createProject
};
