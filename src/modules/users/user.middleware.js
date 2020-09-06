const UserService = require('./user.service'); // import from module

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

module.exports = {
  createUser,
};
