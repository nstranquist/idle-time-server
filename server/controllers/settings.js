// settings controller
// const mongoose = require('mongoose')
const userModel = require('../modules/users/user.model');
const findUser = require('../utils/findUser');
const findUserProperty = require('../utils/findUserProperty');
// const SettingsSchema = require('../models/settings')

// const settingsModel = mongoose.model("Settings", SettingsSchema)

module.exports = {
  getAll: async (req, res, next) => {
    const { userId } = req.body;

    try {
      const userSettings = await findUserProperty(userId, 'settings', next);
      if (!userSettings.ok) return next();
      const { settings } = userSettings.result;
      delete settings._id;
      res.status(200).json({ status: 'success', message: 'found your settings!', data: { settings } });
    } catch (error) {
      console.log('error');
      throw new Error(error.toString());
    }
  },
  getSection: async (req, res, next) => {
    const { userId } = req.body;
    const sectionName = req.params.name;
    const sectionNameTrim = sectionName.trim();

    // section names: "work", "timetracking", "timeshift", "general", "ui"
    const userSettingsSection = await findUserProperty(userId, `settings.${sectionNameTrim}`, next);
    if (!userSettingsSection) return next();
    console.log('user settings found:', userSettingsSection);

    if (settings) res.status(200).json({ status: 'success', message: 'found your settings!', data: { settingsSection: userSettingsSection } });
    else res.status(400).json({ status: 'error', message: "could not find the user's settings", data: null });
  },
  updateSection: async (req, res, next) => {
    const { userId } = req.body;
    const sectionName = req.params.name;
    const { sectionSettings } = req.body;

    const user = await findUser(userId);
    if (!user) return next();
    console.log('user found:', user);

    user.settings[sectionName] = sectionSettings;

    try {
      const updatedUser = await user.save();
      console.log('updated user:', updatedUser);
      res.status(200).json({
        status: 'success',
        message: `updated user ${sectionName} settings`,
        data: { sectionSettings: updatedUser.settings[sectionName] },
      });
    } catch (error) {
      console.log('error:', error);
      res.status(400).json({
        status: 'error',
        message: `could not update user ${sectionName} settings`,
        data: null,
      });
    }
  },
  // replaces the existing settings with the new ones. This is dangerous!! Maybe remove?
  updateAll: async (req, res, next) => {
    const { userId } = req.body;
    const newSettings = req.body.settings;

    const user = await findUser(userId);
    if (!user) return next();
    console.log('user found:', user);

    user.settings = newSettings;

    try {
      const updatedUser = await user.save();
      console.log('updated user settings:', updatedUser.settings);
      res.status(200).json({
        status: 'success',
        message: 'updated user settings',
        data: { settings: updatedUser.settings },
      });
    } catch (error) {
      console.log('error:', error);
      res.status(400).json({
        status: 'error',
        message: 'could not update user settings',
        data: null,
      });
    }
  },
};
