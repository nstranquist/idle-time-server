const mongoose = require('mongoose')

const Schema = mongoose.Schema;


// const TasksCollectionSchema = new Schema({
//   tasks: {
//     type: [TaskSchema],
//     default: [],
//   },
//   order: {
//     type: Map,
//     of: String,
//   },
// })

// const TasksOrderSchema = new Schema({
//   order: {
//     type: Map,
//     of: String,
//   }
// })

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
    trim: false,
    required: true,
  },
  priority: {
    type: Number,
    default: 1,
    required: true,
  },
})

module.exports = mongoose.model("Task", TaskSchema)

// tasksOrderModel: mongoose.model("TasksOrder", TasksOrderSchema),
