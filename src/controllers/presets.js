// app/api/controllers/presets.js

const PresetSchema = require('../models/presets');
const UserModel = require('../models/user.model');
const findUser = require('../utils/findUser');
const findUserProperty = require('../utils/findUserProperty');
const handleResponses = require('../utils/handleResponses');

const { handleSuccess, handleError } = handleResponses;

module.exports = {
  getAll: async (req, res, next) => {
    const { userId } = req.body;

    // reset user presets
    // const user = await findUser(userId)
    // user.presets = [];
    // await user.save();

    const userPresets = await findUserProperty(userId, 'presets', next);
    console.log('userPresets result:', userPresets);
    if (!userPresets.ok) handleError(res, userPresets.message);
    else if (userPresets.result) {
      const { presets } = userPresets.result;
      console.log('presets found:', presets);
      res.status(200).json({
        ok: true,
        message: 'Found your task presets',
        data: { presets },
      });
    } else next();
  },
  addOne: async (req, res, next) => {
    const { userId } = req.body;
    const presetBody = req.body.preset;

    const userResult = await findUser(userId);
    if (!userResult) next();

    // save presetBody to userResult
    console.log('preset body:', presetBody);
    // const newPreset = new PresetSchema(presetBody)
    userResult.presets.push(presetBody);
    const presetsLength = userResult.presets.length;

    try {
      const updatedUser = await userResult.save();
      console.log('updated user:', updatedUser);
      res.status(201).json({
        ok: true,
        message: 'added your preset',
        // should return the entire object so that can get defaults created by mongoose
        data: { preset: updatedUser.presets[presetsLength - 1] },
      });
    } catch (error) {
      console.log('error:', error);
      next();
    }
  },
  updateOne: async (req, res, next) => {
    const { userId } = req.body;
    const presetId = req.params.id;
    const presetBody = req.body.preset;

    const presetUpdateOptions = {};
    if (presetBody.title) presetUpdateOptions.title = presetBody.title;
    if (presetBody.category) presetUpdateOptions.category = presetBody.category;
    if (presetBody.taskData) presetUpdateOptions.taskData = presetBody.taskData;
    if (presetBody.timeshiftData) presetUpdateOptions.timeshiftData = presetBody.timeshiftData;
    if (presetBody.scheduleData) presetUpdateOptions.scheduleData = presetBody.scheduleData;

    if (!presetId || !presetBody) return handleError(res, 'Invalid request, preset data is undefined');

    const userResult = await findUser(userId);
    if (!userResult) next();

    // update an item in the presets array, within users
    const updateResult = await userResult
      .update(
        { 'presets._id': presetId },
        { $set: presetUpdateOptions },
        (err, result) => {
          if (err) next();
          else {
            console.log('result (inside of mongodb):', result);
            res.status(200).json({
              ok: true,
              message: 'updated your preset',
              data: { preset: result },
            });
          }
        }
      )
      .lean();
    console.log(
      'update result (not returned to client), outside of mongodb update:',
      updateResult
    );
  },
  deleteOne: async (req, res, next) => {
    const { userId } = req.body;
    const presetId = req.params.id;

    const userResult = await findUser(userId);
    if (!userResult) next();

    const presetIndex = await userResult.presets.findIndex(
      (preset) => preset._id.toString() === presetId
    );
    if (presetIndex < 0) {
      return res
        .status(400)
        .json({ ok: false, message: 'preset not found', data: null });
    }

    userResult.presets.splice(presetIndex, 1);

    try {
      await userResult.save().then(() => {
        res.status(200).json({
          ok: true,
          message: 'deleted your preset',
          data: { id: presetId },
        });
      });
    } catch (error) {
      console.log('error deleting preset:', error);
      next();
    }
  },
  // deleteByTaskId: async (req, res, next) => {
  //   const userId = req.body.userId;
  //   const taskId = req.params.id;

  //   let userResult = await findUser(userId)
  //   if(!userResult) next();

  //   const presetIndex = await userResult.presets.findIndex(preset => preset._id.toString() === taskId);
  //   if(presetIndex < 0) return res.status(400).json({ok: false, message: "preset not found", data: null })

  //   userResult.presets.splice(presetIndex, 1)

  //   try {
  //     await userResult.save().then(() => {
  //       res.status(200).json({
  //         ok: true,
  //         message: "deleted your preset",
  //         data: { id: taskId }
  //       })
  //     })
  //   } catch (error) {
  //     console.log('error deleting preset:', error)
  //     next();
  //   }
  // },
};
