const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const TaskSchema = require('./tasks')
const SettingsSchema = require('./settings')
const TimeLogSchema = require('./timetracking')
// const TemplateSchema = require('./templates')

const saltRounds = 10;

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true
    // unique: true // throws "use createIndex instead of ensureIndex" error
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
  tasks: { // or rename to 'timeblocking'
    tasks: {
      type: [TaskSchema],
      default: [],
      required: true
    },
    order: {
      type: [mongoose.Schema.Types.ObjectId], // Array of id's
      default: [],
      required: true
    },
    // hoursWorked: Number, currentTask: ObjectId, isOverTime: Boolean, hasStarted: Boolean, etc...
  },
  // templates: [TemplateSchema], // either this or inside 'tasks'
  archives: {
    tasks: [TaskSchema] // for old tasks
    // ...alarms, 
  },
  settings: SettingsSchema,
  timelogs: {
    type: [TimeLogSchema], // settings for timelogs either inside of it, or in 'settings'
    default: [],
    // timestamps: true
  },
  // alarms: AlarmSchema,
  // timetracking: {
  //   timelogs: TimeLogSchema,
  //   settings: {
  //     workStart: String,
  //     workEnd: String,
  //     workDuration: Number
  //   }
  // }
  status: {
    is_member: {
      type: Boolean,
      default: false
    },
    is_new: {
      type: Boolean,
      default: true
    }
  }
},
{ timestamps: true } // 'createdAt' and 'updatedAt' mongoose Date types (timestamp)
);


// hash user password before saving into database
UserSchema.pre("save", function (next) {
  const user = this;
  if(!user.isModified("password"))
    return next();

  user.password = bcrypt.hashSync(user.password, saltRounds);
  next();
});

module.exports = mongoose.model("User", UserSchema);
