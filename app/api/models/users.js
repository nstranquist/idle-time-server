const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const TaskSchema = require('./tasks')
const ProjectSchema = require('./projects')
const SettingsSchema = require('./settings')
const TimeLogSchema = require('./timetracking')
const PresetSchema = require('./presets')

const saltRounds = 10;

const Schema = mongoose.Schema;

// credit: https://stackoverflow.com/questions/18022365/mongoose-validate-email-syntax
const isEmail = (email) => {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
}

const UserSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: [isEmail, 'Please use a valid email address'],
    // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please use a valid email address']
    // unique: true // throws "use createIndex instead of ensureIndex" error
  },
  password: {
    type: String,
    trim: true,
    required: true,
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
  projects: {
    type: [ProjectSchema],
    default: [],
    required: true
  },
  presets: {
    type: [PresetSchema], // either this or inside 'tasks'
    required: false
  },
  archives: {
    tasks: [TaskSchema], // for old tasks
    presets: [PresetSchema]
    // ...alarms, 
  },
  settings: {
    type: SettingsSchema,
  },
  timelogs: {
    type: [TimeLogSchema], // settings for timelogs either inside of it, or in 'settings'
    default: [],
    // timestamps: true
  },
  // alarms: AlarmSchema,
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
