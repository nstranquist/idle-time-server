const userModel = require('../api/models/users')


// userId: ObjectId, userProperties: 'field1, field2, field3, ...'
const findUserProperty = async (userId, userProperties, nextError) => {
  if(userId && userProperties) {
    console.log('finding user by id:', userId)
    const result = await userModel.findById(userId, userProperties, (err, userInfo) => {
      if(err) return nextError(err);
      else return userInfo;
    })
    return { ok: true, result }
  }
  else {
    if(!userId) return { ok: false, message: "User id was not received" }
    else if(!userProperties) return { ok: false, message: "User properties were not received" }
    else return { ok: false, message: "Internal Error" }
  }
}

module.exports = { findUserProperty }