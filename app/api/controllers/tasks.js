// tasks controller
const mongoose = require('mongoose')
const TaskSchema = require('../models/tasks')
const userModel = require('../models/users')
const findUserProperty = require('../../utils/getUser.utils').findUserProperty;
// const updateUserProperty = require('../../utils/updateUser.utils').updateUserProperty;
const handleResponses = require('../../utils/handleResponses')

const { handleSuccess, handleError } = handleResponses;

const taskModel = mongoose.model("Task", TaskSchema)


module.exports = {
  getAll: async (req, res, next) => {
    const userId = req.body.userId;

    const userInfo = await findUserProperty(userId, 'tasks', next)

    console.log('user info:', userInfo)
    
    if(!userInfo.ok)
      return handleError(res, userInfo.message); // code will default to 400, data will default to 'null'
    else if(userInfo.result) {
      console.log("user info:", userInfo)
      const { tasks, order } = userInfo.result.tasks
      const tasksList = tasks.map(task => ({
        id: task._id,
        title: task.title,
        desc: task.desc,
        duration: task.duration,
        startTime: task.startTime,
        priority: task.priority,
        urlLink: task.url_link
      }))

      return handleSuccess(res, "User's tasks were found!", 200, { tasks: tasksList, order: order }); // code will default to 200
    }
    else
      return handleErorr(res, "Internal error: no results were found", 500)
  },
  //getOne: function (req, res, next) {  },
    // var doc = parent.children.id(_id); // for finding item in children array of parent (where user is parent)
  //getArchivedTasks: function (req, res, next) {  },
  addOne: async (req, res, next) => {
    const taskData = req.body.taskData;
    const userId = req.body.userId;
    console.log('request taskData:', req.body.taskData)

    if(!taskData)
      return handleError(res, "Invalid request, taskData is undefined")

    // const userInfo = await findUser(userId, 'tasks')
    // console.log('user info:', userInfo)


    // const result = await userModel.findByIdAndUpdate(
    //   userId,
    //   {$push: {"tasks.tasks": taskData}},
    //   {upsert: true, new: true}
    // ).lean() // don't really need .lean()

    let userResult
    try {
      userResult = await userModel.findById(userId);
      console.log("user result in try:", userResult)
    }
    catch (err) {
      console.log('error finding user:', err)
    }

    console.log('user result:', userResult)
    userResult.tasks.tasks.push(taskData)
    const tasksLength = userResult.tasks.tasks.length;
    const taskId = userResult.tasks.tasks[tasksLength - 1]._id;
    userResult.tasks.order.push(taskId);

    try {
      const updatedUser = await userResult.save();
      console.log("updated user:", updatedUser)
      res.status(201).json({
        status: "success",
        message: "Successfully added new task",
        data: {
          task: {...taskData, id: taskId},
          order: updatedUser.tasks.order,
        }
      })
    }
    catch (err) {
      console.log('error saving the updatd user:', err)
      res.status(400).json({
        status: "error",
        message: "error adding new task",
        data: null
      })
    }
  },
  updateOne: async (req, res, next) => {
    const taskId = req.params.taskId;
    const taskUpdates = req.body.taskData;
    
    if(!taskId || !taskUpdates)
      return handleError(res, "Invalid request, task data is undefined")
    
    taskModel.findByIdAndUpdate(
      taskId,
      { ...taskUpdates },
      function (err, taskInfo) {
        if (err)
          next(err);
        else {
          const taskData = {
            id: taskInfo._id,
            title: taskInfo.title,
            desc: taskInfo.desc,
            duration: taskInfo.duration,
            startTime: taskInfo.startTime,
            priority: taskInfo.priority,
          }
          return handleSuccess(res, "Task updated successfully!", 200, { taskData })
        }
      }
    );
  },
  deleteOne: async (req, res, next) => {
    const taskId = req.params.taskId;
    const userId = req.body.userId;
    
    if(!taskId)
      return handleError(res, "Invalid request, taskId is undefined")

    // const user = await userModel.findById(userId)
    // user.tasks = { tasks: [], order: []}
    // await user.save();

    // const user = await userModel.findById(userId)
    // const { tasks, order } = user.tasks;
    // const newTasks = [];
    // for(let i=0; i<tasks.length; i++) {
    //   if(tasks[i]._id !== taskId)
    //     newTasks.push(tasks[i])
    // }
    // user.tasks.tasks = newTasks;
    // user.tasks.order = order.filter(id => id !== taskId);

    // console.log('user:', user)

    res.status(200).json({
      status: "success",
      message: "feature in progress",
      data: null
    })

    // const updatedUser = await user.save();    
    // console.log('updated user:', updatedUser)

      // taskModel.findByIdAndRemove(taskId, function (err, taskInfo) { // note: should use findByIdAndDelete ?!
    //   console.log('task info:', taskInfo)
    //   if (err)
    //     next(err);
    //   else
    //     return handleSuccess(res, "Task deleted successfully")
    // });
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