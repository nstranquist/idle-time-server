const mongoose = require('mongoose');
const TimeshiftSchema = require('./submodels/timeshift');

const { Schema } = mongoose;

// NOTE: These settings need to be moved into User Schema, as embedded sub-document

const SettingsSchema = new Schema({
  // work settings
  work: {
    workStart: {
      type: String,
      default: '8:00 am',
    },
    workEnd: {
      type: String,
      default: '6:00 pm',
      required: false,
    },
    workDuration: {
      type: Number,
      default: 10,
      min: 0,
      max: 24,
    },
  },

  // timetracking settings
  timetracking: {
    allowEdits: { type: Boolean, default: true },
    trackTime: { type: Boolean, default: true },
    calendarIntegration: { type: Boolean, default: false },
    // integrations: {
    //   type: null | Object,
    //   default: null
    // }
  },

  timeshift: {
    type: TimeshiftSchema,
  },

  // general settings, the most commonly-adjusted and quickly accessed
  general: {
    showTime: {
      type: Boolean,
      default: false,
    },
    alarmsActive: {
      type: Boolean,
      default: true,
    },
    // hardMode: { type: Boolean, default: false },
    dayOrWeekView: {
      type: String,
      default: 'day',
      enum: ['day', 'week'],
    },
    timeshiftActive: {
      type: Boolean,
      default: false,
    },
    // theme: { type: String, default: "light", enum: ["light", "dark"]},
  },

  // ui-type stuff
  ui: {
    sidebarOpen: {
      type: Boolean,
      default: true,
    },
    priorityColors: {
      type: [String], // ordered from 1-4
      default: ['#FF3860', '#FFDD57', '#48C774', '#fff'], // danger, warning, success, white
    },
    // ...
  },
});

module.exports = SettingsSchema;
