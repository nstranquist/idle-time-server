const mongoose = require('mongoose')
const TimeLogSchema = require("../models/timetracking");

const timelogModel = mongoose.model("TimeLog", TimeLogSchema);


module.exports = {
  getAll: function (req, res, next) {
    timelogModel.find({}, (err, timelogs) => {
      if(err)
        next(err);
      else {
        console.log('got timelogs:', timelogs)
        const responseLogs = timelogs.map(timelog => ({
          id: timelog._id,
          title: timelog.title,
          desc: timelog.desc,
          duration: timelog.duration,
          startTime: timelog.startTime,
          priority: timelog.priority
        }))

        res.status(200).json({
          status: 'success',
          message: "Found your timelogs",
          data: { timelogs: responseLogs }
        })
      }
    })
  },
  getOne: function (req, res, next) {
    const timelogId = req.params.timelogId;

    if(!timelogId)
      res.status(400).json({
        status: "error",
        message: "did not specify an id to get the timelog with",
        data: null
      })
    else {
      timelogModel.find({ _id: timelogId }, (err, timelog) => {
        if(err)
          next(err);
        else {
          console.log('got the timelog:', timelog)
          const foundTimelog = {
            id: timelog._id,
            title: timelog.title,
            desc: timelog.desc,
            duration: timelog.duration,
            startTime: timelog.startTime,
            priority: timelog.priority
          }
          res.status(200).json({
            status: "success",
            message: "Found your timelog",
            data: { timelog: foundTimelog }
          })
        }
      })
    }
  },
  addOne: function (req, res, next) {
    console.log('request body:', req.body)
    const timelogData = req.body.timelog;

    if(!timelogData)
      res.status(400).json({
        status: "error",
        message: "Did not receive a timelog to add",
        data: null
      })
    else
      timelogModel.create(timelogData, (err, result) => {
        if(err)
          next(err);
        else {
          console.log('success result:', result)
          const newTimelog = {
            id: result._id,
            title: result.title,
            desc: result.desc,
            duration: result.duration,
            startTime: result.startTime,
            priority: result.priority
          }
          res.status(201).json({
            status: 'success',
            message: "Successfully added your timelog",
            data: {timelog: newTimelog}
          })
        }
      })
  },
  updateOne: function (req, res, next) {
    const timelogId = req.params.timelogId;
    const timelogData = req.body.timelogData;

    if(!timelogId || !timelogData)
      res.status(400).json({
        status: "error",
        message: "Did not receive the id or data to update your time log with",
        data: null
      })
    else
      timelogModel.findByIdAndUpdate(timelogId, (err, result) => {
        if(err)
          next(err);
        else {
          console.log('updated timelog with result:', result)
          res.status(200).json({
            status: "success",
            message: "Upated timelog successfully",
            data: {timelog: result}
          })
        }
      })
  },
  deleteOne: function (req, res, next) {
    if(!req.params.id) {
      res.status(400).json({
        status: "error",
        message: "Did not receive the id of the timelog to delete",
        data: null
      })
    }
    else {
      timelogModel.deleteOne({"_id": req.params.id}, (err, result) => {
        if(err) {
          console.log('error removing timelog with id:', req.params.id, "error:", err)
          next(err);
        }
        else {
          res.status(200).json({
            status: "success",
            message: "Deleted timelog successfully",
            data: null
          })
        }
      })
    }
  }
}