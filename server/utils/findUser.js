const userModel = require('../models/UserModel');

const findUser = async (userId, next = undefined) => {
  let userResult;
  try {
    userResult = await userModel.findById(userId);
    if (userResult) return userResult;
    return undefined;
  } catch (err) {
    console.log('error finding user:', err);
    if (next) next();
    else return undefined;
  }
};

module.exports = findUser;
