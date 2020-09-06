const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const TaskSchema = require('../../models/tasks');
const ProjectSchema = require('../../models/projects');
const SettingsSchema = require('../../models/settings');
const TimeLogSchema = require('../../models/timetracking');
const PresetSchema = require('../../models/presets');

const saltRounds = 10;

const { Schema } = mongoose;

// credit: https://stackoverflow.com/questions/18022365/mongoose-validate-email-syntax
const isEmail = (email) => {
  const re = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate: [ isEmail, 'Please use a valid email address' ],
      // match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please use a valid email address']
      // unique: true // throws "use createIndex instead of ensureIndex" error
    },
    password: {
      type: String,
      trim: true,
      required: true,
      minlength: 8,
    },
    tasks: {
      // or rename to 'timeblocking'
      tasks: {
        type: [ TaskSchema ],
        default: [],
        required: true,
      },
      order: {
        type: [ mongoose.Schema.Types.ObjectId ], // Array of id's
        default: [],
        required: true,
      },
      // hoursWorked: Number, currentTask: ObjectId, isOverTime: Boolean, hasStarted: Boolean, etc...
    },
    projects: {
      type: [ ProjectSchema ],
      default: [],
      required: true,
    },
    presets: {
      type: [ PresetSchema ], // either this or inside 'tasks'
      required: false,
    },
    archives: {
      tasks: [ TaskSchema ], // for old tasks
      presets: [ PresetSchema ],
      // ...alarms,
    },
    settings: {
      type: SettingsSchema,
    },
    timelogs: {
      type: [ TimeLogSchema ], // settings for timelogs either inside of it, or in 'settings'
      default: [],
      // timestamps: true
    },
    // alarms: AlarmSchema,
    status: {
      is_member: {
        type: Boolean,
        default: false,
      },
      is_new: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

// Hash user password before saving into database
UserSchema.pre('save', async function preSave(next) {
  const user = this;
  if (!user.isModified('password')) return next();

  try {
    const hash = await bcrypt.hash(user.password, saltRounds);
    user.password = hash;
    return next();
  } catch (error) {
    return next(error);
  }
});

UserSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', UserSchema);
