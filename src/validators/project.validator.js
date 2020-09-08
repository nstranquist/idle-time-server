const Joi = require('joi');

const createProject = Joi.object().keys({
  name: Joi.string().required()
});

module.exports = {
  createProject
};
