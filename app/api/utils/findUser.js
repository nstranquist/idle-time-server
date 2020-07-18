const userModel = require('../models/users')

const findUser = async (userId, next=undefined) => {
  let userResult;
  try {
    userResult = await userModel.findById(userId);
    if(userResult) return userResult;
    else return undefined;
  }
  catch (err) {
    console.log('error finding user:', err)
    if(next) next();
    else return undefined;
  }
}

module.exports = findUser