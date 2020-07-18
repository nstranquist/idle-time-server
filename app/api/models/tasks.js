const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title: {
    type: String,
    trim: false,
    required: true,
  },
  desc: {
    type: String,
    trim: false,
    required: false,
  },
  duration: {
    type: Number,
    required: true,
    default: 10,
  },
  startTime: {
    type: String,
    default: new Date().toISOString(),
    required: false,
  },
  priority: {
    type: Number,
    default: 1,
    required: true,
  },
  url_link: {
    type: String,
    required: false
  },
  dayOfSchedule: {
    type: Number,
    default: 0, // the current day
    required: false
  }
}, { timestamps: true } // assigns 'createdAt' and 'updatedAt' fields to object. Of type Date. Date is basically a timestamp
)

module.exports = TaskSchema;
