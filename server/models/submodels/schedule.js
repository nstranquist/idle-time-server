const mongoose = require('mongoose')
const TaskSchema = require('../tasks')

const Schema = mongoose.Schema;

const ScheduleSchema = new Schema ({
  tasks: {
    type: [TaskSchema],
    default: [],
    required: true
  },
  multipleDays: {
    type: Boolean,
    default: false,
    required: true
  },
  // other time data? how many per day, etc
  numberOfDays: {
    type: Number,
    min: 2,
    max: 31, // max 30 days for now
    default: 2, // 1 day is 1 day
    required: false
  }
})

module.exports = ScheduleSchema;