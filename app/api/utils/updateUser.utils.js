const userModel = require('../models/users')

// Updates a single user property
const updateUserProperty = (userId, propertyName, updateData, nextError) => {
  if(userId && userProperty) {
    console.log('finding user by id:', userId)
    const result = await userModel.findByIdAndUpdate(userId, { [propertyName]: updateData }, (err, userInfo) => {
      if(err) return nextError(err);
      else {
        console.log('find by id and update user info result:', userInfo)
        return userInfo;
      }
    })
    console.log('result (outside of query):', result)
    return { ok: true, result }
  }
  else {
    if(!userId) return { ok: false, message: "User id was not received" }
    else if(!userProperties) return { ok: false, message: "User properties were not received" }
    else return { ok: false, message: "Internal Error" }
  }
}

module.exports = { updateUserProperty }