const mongoose = require('mongoose')

const Schema = mongoose.Schema;

const TimeLogSchema = new Schema({
  title: {
    type: String,
    required: true
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
  // metaData: {
  //   type: Object,
  //   required: false
  // }
},
{ timestamps: true}
);

module.exports = mongoose.model("TimeLog", TimeLogSchema);
