const UserService = require('../services/UserService'); // import from module

// Include middleware to validate request body

const createUser = (req, res, next) => {
  UserService.createUser(req.body)
    .then((data) => {
      req.response = data;
      next();
    })
    .catch((error) => {
      next(error);
    });
};

const validateNewUser = (req, res, next) => {
  next();
};

module.exports = {
  createUser,
  validateNewUser
};
