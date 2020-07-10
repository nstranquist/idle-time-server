const mongoose = require('mongoose')

const Schema = mongoose.Schema;

// NOTE: These settings need to be moved into User Schema, as embedded sub-document

const SettingsSchema = new Schema({
  showTime: {
    type: Boolean,
    default: false
  },
  timeshiftActive: {
    type: Boolean,
    default: false
  },
  alarmsActive: {
    type: Boolean,
    default: true
  }
})

module.exports = mongoose.model("Settings", SettingsSchema);