// settings controller
const settingsModel = require('../models/settings')

module.exports = {
  get: function (req, res, next) {
    settingsModel.find({}, (err, settingsInfo) => {
      if(err)
        next(err);
      else {
        const userSettings = settingsInfo.map((setting) => ({
          id: setting._id,
          
        }))
        res.status(200).json({
          status: "success",
          message: "found user settings",
          data: {userSettings},
        })
      }
    })
  },
  update: function(req, res, next) {
    const settingsId = req.params.settingsId;
    const settingsUpdates = req.body.settingsUpdates;
    
    if(!settingsId || settingsUpdates)
      res.status(400).json({
        status: "error",
        message: "improper request, id or updates not found",
        data: null
      })

    settingsModel.findByIdAndUpdate(settingsId, {...settingsUpdates}, (err, settingsInfo) => {
      if(err)
        next(err);
      else {
        console.log('settings info:', settingsInfo)
        res.status(200).json({
          status: "success",
          message: "successfully updated settings",
          data: {settings: settingsInfo}
        })
      }
    })
  }
}