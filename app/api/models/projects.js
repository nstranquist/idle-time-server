const mongoose = require('mongoose')

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  desc: { type: String, required: false },
  tasks: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
    required: true
  },
  isBillable: {
    type: Boolean,
    default: false,
    required: true
  },
  isActive: { type: Boolean, default: true, required: true }, // or 'isArchived'?
  payRate: {
    type: Number,
    required: false
  }
}, { timestamps: true }
)

module.exports = ProjectSchema;