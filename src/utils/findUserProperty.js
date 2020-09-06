const userModel = require('../modules/users/user.model');

// userId: ObjectId, userProperties: 'field1, field2, field3, ...'
const findUserProperty = async (userId, userProperties, nextError) => {
  if (userId && userProperties) {
    const result = await userModel
      .findById(userId, userProperties, (err, userInfo) => {
        console.log('user property:', userInfo[userProperties]);
        if (err) return nextError(err);
        return userInfo;
      })
      .lean();
    return { ok: true, result };
  }

  if (!userId) return { ok: false, message: 'User id was not received' };
  if (!userProperties) return { ok: false, message: 'User properties were not received' };
  return { ok: false, message: 'Internal Error' };
};

module.exports = findUserProperty;
