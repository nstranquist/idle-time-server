/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken');
const UserService = require('../services/UserService');
const UserModel = require('../models/user.model');

const tokenExpirationTime = '4h';

const create = async (req, res, next) => {
  const userService = new UserService(UserModel);
  const { email } = req.body;

  // the 'try/catch' error boundary is done inside of the UserService
  const emailExists = await userService.ensureUniqueEmail(email);

  if (emailExists) return res.status(400).json({ status: 'error', message: 'User already exists' });

  const response = await userService.createUser(req.body);
  if (response.error) return res.status(response.statusCode).json(response.json);
  return res.status(201).json({ status: 'success', message: 'User created successfully' });
};

const authenticate = async (req, res, next) => {
  const userService = new UserService(UserModel);
  const { email, password } = req.body;

  const userResponse = await userService.findUserByEmail(email);
  if (userResponse.error) return res.status(userResponse.statusCode).json(userResponse.json);

  const response = await userService.compareUserPassword(password, userResponse.password);
  if (response.error) return res.status(response.statusCode).json(response.json);

  const token = jwt.sign(
    { id: userResponse._id },
    req.app.get('secretKey'),
    { expiresIn: tokenExpirationTime } // 4h
  );

  const validResponse = {
    ...response.json,
    data: {
      userData: {
        _id: userResponse._id,
        name: userResponse.name,
        email: userResponse.email,
      },
      userSettings: userResponse.settings ? userResponse.settings : [],
      userStatus: userResponse.status.is_new ? { is_new: true } : { is_member: userResponse.status.is_member },
      // userStatus: { is_new: true },
      token,
    }
  };

  return res.status(200).json(validResponse);
};

const resetPassword = async (req, res, next) => {
  console.log('out of commission');
  return res.status(400).json({ status: 'error', message: 'Feature not implemented yet' });
};

const getUserData = async (req, res, next) => {
  console.log('out of commission');
  return res.status(400).json({ status: 'error', message: 'Feature not implemented yet' });
};

module.exports = {
  create,
  authenticate,
  resetPassword,
  getUserData
};
