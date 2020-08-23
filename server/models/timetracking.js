const mongoose = require('mongoose');

const { Schema } = mongoose;

const TimeLogSchema = new Schema({
  task_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: false,
  },
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: false,
  },
  duration: {
    type: Number,
    default: 10,
    required: true,
  },
},
{ timestamps: true });

module.exports = TimeLogSchema;
