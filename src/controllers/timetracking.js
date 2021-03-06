// const mongoose = require('mongoose')
const findUser = require('../utils/findUser');
const findUserProperty = require('../utils/findUserProperty');
// const TimeLogSchema = require("../models/timetracking");
// const timelogModel = mongoose.model("TimeLog", TimeLogSchema);
const handleResponses = require('../utils/handleResponses');

const { handleSuccess, handleError } = handleResponses;

module.exports = {
  getAll: async (req, res, next) => {
    const { userId } = req.body;

    const userResult = await findUserProperty(userId, 'timelogs', next);
    if (!userResult.ok) return handleError(res, userResult.message);
    if (userResult.result) {
      const { timelogs } = userResult.result;
      console.log('timelogs:', timelogs);
      res
        .status(200)
        .json({
          ok: true,
          message: 'found your timelogs',
          data: { timelogs },
        });
    } else return handleError(res, 'Internal error: no results were found', 500);
  },
  addOne: async (req, res, next) => {
    const { userId, timelog } = req.body;

    if (!timelog) {
      return res
        .status(400)
        .json({
          ok: false,
          message: 'timelog data not provided',
          data: null,
        });
    }

    const user = await findUser(userId);
    if (!user) return next();

    const { length } = user.timelogs;
    user.timelogs.push(timelog);

    try {
      const updatedUser = await user.save();
      console.log('updated user:', updatedUser);
      return res.status(200).json({
        ok: true,
        message: 'added your timelog',
        data: { timelog: updatedUser.timelogs[length] },
      });
    } catch (error) {
      console.log('error:', error);
      return res.status(400).json({
        ok: false,
        message: 'could not add the timelog to user\'s timelogs',
        data: null,
      });
    }
  },
  updateOne: async (req, res, next) => {
    const { timelogId } = req.params;
    const { userId, timelogData } = req.body;

    const user = await findUser(userId);
    if (!user) return next();

    // update their logs
    console.log('need to find a way to update nested array with mongodb');

    try {
      const updatedUser = await user.save();
      console.log('updated user:', updatedUser);
      return res
        .status(200)
        .json({
          ok: true,
          message: 'updated your timelog',
          data: { timelog: timelogId },
        });
    } catch (error) {
      console.log('error:', error);
      return res
        .status(400)
        .json({
          ok: false,
          message: 'could not update your timelog',
          data: null,
        });
    }
  },
  deleteOne: async (req, res, next) => {
    const { userId } = req.body;
    const { timelogId } = req.params;

    const user = await findUser(userId);
    if (!user) return next();

    const foundIndex = await user.timelogs.findIndex(
      (timelog) => timelog._id.toString() === timelogId
    );
    if (foundIndex < 0) {
      return res
        .status(400)
        .json({
          ok: false,
          message: 'Could not find timelog with that id',
          data: null,
        });
    }

    user.timelogs.splice(foundIndex, 1);

    try {
      const updatedUser = await user.save();
      console.log('updated user after delete:', updatedUser);
      res.status(200).json({
        ok: true,
        message: 'deleted user\'s timelog successfully',
        data: { id: timelogId },
      });
    } catch (error) {
      console.log('error:', error);
      next();
    }
  },
};

// getOne: async (req, res, next) => {
//   const timelogId = req.params.timelogId;

//   if(!timelogId)
//     res.status(400).json({
//       ok: false,
//       message: "did not specify an id to get the timelog with",
//       data: null
//     })
//   else {
//     timelogModel.find({ _id: timelogId }, (err, timelog) => {
//       if(err)
//         next(err);
//       else {
//         console.log('got the timelog:', timelog)
//         const foundTimelog = {
//           id: timelog._id,
//           title: timelog.title,
//           desc: timelog.desc,
//           duration: timelog.duration,
//           startTime: timelog.startTime,
//           priority: timelog.priority
//         }
//         res.status(200).json({
//           ok: true,
//           message: "Found your timelog",
//           data: { timelog: foundTimelog }
//         })
//       }
//     })
//   }
// },

// if(!timelogId || !timelogData)
//     res.status(400).json({
//       ok: false,
//       message: "Did not receive the id or data to update your time log with",
//       data: null
//     })
//   else
//     timelogModel.findByIdAndUpdate(timelogId, (err, result) => {
//       if(err)
//         next(err);
//       else {
//         console.log('updated timelog with result:', result)
//         res.status(200).json({
//           ok: true,
//           message: "Upated timelog successfully",
//           data: {timelog: result}
//         })
//       }
//     })

// if(!req.params.id) {
//   res.status(400).json({
//     ok: false,
//     message: "Did not receive the id of the timelog to delete",
//     data: null
//   })
// }
// else {
//   timelogModel.deleteOne({"_id": req.params.id}, (err, result) => {
//     if(err) {
//       console.log('error removing timelog with id:', req.params.id, "error:", err)
//       next(err);
//     }
//     else {
//       res.status(200).json({
//         ok: true,
//         message: "Deleted timelog successfully",
//         data: null
//       })
//     }
//   })
// }
