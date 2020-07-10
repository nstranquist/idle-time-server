// tasks controller
const taskModel = require('../models/tasks')


module.exports = {
  getAll: function (req, res, next) {
    taskModel.find({}, function (err, tasks) {
      if (err) {
        next(err);
      } else {
        const tasksList = tasks.map(task => ({
          id: task._id,
          title: task.title,
          desc: task.desc,
          duration: task.duration,
          startTime: task.startTime,
          priority: task.priority,
        }))

        res.status(200).json({
          status: "success",
          message: "Tasks list found!",
          data: { tasks: tasksList },
        });
      }
    });
  },
  //getOne: function (req, res, next) {  }
  addOne: function (req, res, next) {
    const taskData = req.body.taskData;
    console.log('request taskData:', req.body.taskData)

    if(!taskData)
      res.status(400).json({
        status: "error",
        message: "Invalid request, taskData is undefined",
        data: null,
      })

    taskModel.create(
      taskData,
      function (err, result) {
        if (err)
          next(err);
        else {
          console.log('result:', result)
          const taskResult = {
            id: result._id,
            title: result.title,
            desc: result.desc,
            duration: result.duration,
            startTime: result.startTime,
            priority: result.priority
          }
          res.status(201).json({
            status: "success",
            message: "Task added successfully!",
            data: { taskData: taskResult },
          });
          // return;
        }
      }
    );
  },
  updateOne: function (req, res, next) {
    const taskId = req.params.taskId;
    const taskUpdates = req.body.taskData;
    
    if(!taskId || !taskUpdates)
      res.status(400).json({
        status: "error",
        message: "Invalid request, task data is undefined",
        data: null,
      })
    
    taskModel.findByIdAndUpdate(
      taskId,
      { ...taskUpdates },
      function (err, taskInfo) {
        if (err)
          next(err);
        else {
          res.status(200).json({
            status: "success",
            message: "Task updated successfully!",
            data: {
              taskData: {
                id: taskInfo._id,
                title: taskInfo.title,
                desc: taskInfo.desc,
                duration: taskInfo.duration,
                startTime: taskInfo.startTime,
                priority: taskInfo.priority,
              }
            }
          });
        }
      }
    );
  },
  deleteOne: function (req, res, next) {
    const taskId = req.params.taskId;
    
    if(!taskId)
      res.status(400).json({
        status: "error",
        message: "Invalid request, taskId is undefined",
        data: null,
      })

    // note: could also use req.params.taskId instead. Maybe it'd be lighter-weight
    taskModel.findByIdAndRemove(taskId, function (err, taskInfo) { // note: should use findByIdAndDelete ?!
      console.log('task info:', taskInfo)
      if (err)
        next(err);
      else {
        res.status(200).json({
          status: "success",
          message: "Task deleted successfully",
          data: null
        });
      }
    });
  }
  // getOrder: function(req, res, next) {
  //   tasksOrderModel.find({}, function (err, tasksOrder) {
  //     if(err)
  //       next(err);
  //     else {
  //       console.log('found tasksOrder:', tasksOrder)
  //       res.status(200).json({
  //         status: 'success',
  //         message: "Foudn the Tasks Order",
  //         data: { tasksOrder: tasksOrder }
  //       })
  //     }
  //   })
  // },
  // updateOrder: function(req, res, next) {
  //   // Update the tasks order model

  //   // tasksOrderModel.
  // },
}