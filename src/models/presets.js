const mongoose = require('mongoose');
const TaskSchema = require('./tasks');
const TimeshiftSchema = require('./submodels/timeshift');
const ScheduleSchema = require('./submodels/schedule');

const { Schema } = mongoose;

const PresetSchema = new Schema(
  {
    title: {
      // title of the preset, not the task itself!
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'task', // "task", "timeshift", "schedule",
      required: true, // if default is set, this should always work even if none provided?
    },
    // types of schema data (which are NOT required)
    taskData: {
      type: TaskSchema,
      required: false,
    },
    timeshiftData: {
      type: TimeshiftSchema,
      required: false,
    },
    scheduleData: {
      type: ScheduleSchema,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = PresetSchema;
