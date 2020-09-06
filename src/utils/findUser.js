const userModel = require('../modules/users/user.model');

const findUser = async (userId, next = undefined) => {
  let userResult;
  try {
    userResult = await userModel.findById(userId);
    if (userResult) return userResult;
    return undefined;
  } catch (err) {
    console.log('error finding user:', err);
    if (next) return next();
    return undefined;
  }
};

module.exports = findUser;
