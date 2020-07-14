const mongoose = require('mongoose')

const Schema = mongoose.Schema;

// NOTE: These settings need to be moved into User Schema, as embedded sub-document

const SettingsSchema = new Schema({
  // work settings
  workStart: {
    type: String,
    default: "8:00 am"
  },
  workEnd: {
    type: String,
    default: "6:00 pm"
  },
  workDuration: {
    type: Number,
    default: 10,
    min: 0,
    max: 24
  },

  // timetracking settings
  trackTime: {
    type: Boolean,
    default: true
  },
  // allowEdits: { type: Boolean, default: true },

  // ui-type stuff
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
  },
  dayOrWeekView: {
    type: String,
    default: "day",
    enum: ["day", "week"]
  },
  sidebarOpen: {
    type: Boolean,
    default: true
  },
})

module.exports = SettingsSchema