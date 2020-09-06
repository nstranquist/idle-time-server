const UserModel = require('../modules/users/user.model');

// Updates a single user property
const updateUserProperty = async (
  userId,
  propertyName,
  updateData,
  nextError
) => {
  if (userId && propertyName) {
    const result = await UserModel.findByIdAndUpdate(
      userId,
      { [propertyName]: updateData },
      (err, userInfo) => {
        if (err) return nextError(err);

        console.log('find by id and update user info result:', userInfo);
        return userInfo;
      }
    );
    console.log('result (outside of query):', result);
    return { ok: true, result };
  }

  if (!userId) return { ok: false, message: 'User id was not received' };
  if (!propertyName) return { ok: false, message: 'User properties were not received' };
  return { ok: false, message: 'Internal Error' };
};

module.exports = { updateUserProperty };
