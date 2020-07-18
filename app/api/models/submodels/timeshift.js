const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const TimeshiftSchema = new Schema({
  excludeDigits: {
    type: [Number], // 0-9
    default: [],
    required: true
  },
  roundUpBy: {
    type: Number,
    default: 0, // if 0, there is no round-up. idea: -1??
    required: true
  },
  
  // optionals
  hardMode: { // can't toggle back to normal?
    type: Boolean,
    default: false,
    required: false
  },
  startTime: { // time when timeshift activates
    type: Date,
    required: false
  },
  endTime: { // time when timeshift deactivates
    type: Date,
    required: false
  }
})

module.exports = TimeshiftSchema;