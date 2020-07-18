// tasks controller
const mongoose = require('mongoose')
const TaskSchema = require('../models/tasks')
const userModel = require('../models/users')
const findUser = require('../utils/findUser')
const findUserProperty = require('../utils/findUserProperty');
// const updateUserProperty = require('../../utils/updateUser.utils').updateUserProperty;
const handleResponses = require('../utils/handleResponses')

const { handleSuccess, handleError } = handleResponses;

// const taskModel = mongoose.model("Task", TaskSchema)

// const taskExample = ({
//   _id: task._id,
//   title: task.title,
//   desc: task.desc,
//   duration: task.duration,
//   startTime: task.startTime,
//   priority: task.priority,
//   urlLink: task.url_link
// })

module.exports = {
  getAll: async (req, res, next) => {
    const userId = req.body.userId;

    const userInfo = await findUserProperty(userId, 'tasks', next)

    console.log('user info:', userInfo)
    
    if(!userInfo.ok)
      return handleError(res, userInfo.message); // code will default to 400, data will default to 'null'
    else if(userInfo.result) {
      const { tasks, order } = userInfo.result.tasks

      return handleSuccess(res, "User's tasks were found!", 200, { tasks, order }); // code will default to 200
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

    // const result = await userModel.findByIdAndUpdate(
    //   userId,
    //   {$push: {"tasks.tasks": taskData}},
    //   {upsert: true, new: true}
    // ).lean() // don't really need .lean()

    let userResult = await findUser(userId)
    if(!userResult) next();
    else console.log('user result:', userResult)

    userResult.tasks.tasks.push(taskData)
    const tasksLength = userResult.tasks.tasks.length;
    const taskId = userResult.tasks.tasks[tasksLength - 1]._id;
    userResult.tasks.order.push(taskId);

    try {
      const updatedUser = await userResult.save();
      console.log("updated user tasks:", updatedUser.tasks)
      res.status(201).json({
        status: "success",
        message: "Successfully added new task",
        data: {
          task: userResult.tasks.tasks[tasksLength - 1],
          order: updatedUser.tasks.order,
        }
      })
    }
    catch (err) {
      res.status(400).json({
        status: "error",
        message: "error adding new task",
        data: null
      })
    }
  },
  // // updateOne task does NOT imply updating the order of it
  updateOne: async (req, res, next) => {
    const userId = req.body.userId;
    const taskId = req.params.taskId;
    const taskData = req.body.taskData;
    
    if(!taskId || !taskData)
      return handleError(res, "Invalid request, task data is undefined")

    const user = await findUser(userId)
    if(!user) return next();

    const tasks = user.tasks.tasks;
    const taskItem = await tasks.id(taskId)
    if(!taskItem) {
      console.log('task item not found')
      return next();
    }
    else console.log('task item found:', taskItem)
    taskItem.set(taskData)
    console.log('task item after set:', taskItem)

    try {
      const result = await user.save();
      console.log('result:', result)
      res.status(200).json({ status: "success", message: "updated user task", data: {taskData: taskItem}})
    } catch (error) {
      console.log('error:', error)
      res.status(400).json({ status: "error", message: error.toString(), data: null })
    }
  },
  updateOrder: async (req, res, next) => {
    const userId = req.body.userId;
    const order = req.body.order; // either the new order, or the components to create the new order... I think the components would be best long-term

    if(!order)
      return handleError(res, "Invalid request, order is undefined")
    
    try {
      const user = await userModel.findOne({"_id": userId }).lean().exec();
      if(!user) next();
      const order = user.tasks.order;
      const result = await userModel.updateOne(
        { _id: mongoose.Types.ObjectId(userId) },
        { "$set": { "tasks.order": order } }
      )
      console.log('update order result:', result)
      res.status(200).json({ status: "success", message: "updated the tasks order", data: order })
    } catch (error) {
      console.log('error updating task order:', error)
      res.status(400).json({ status: 'error', message: error.toString(), data: null })
    }

    res.status(400).json({
      status: "error",
      message: "this feature is not enabled yet",
      data: null
    })
  },
  deleteOne: async (req, res, next) => {
    const userId = req.body.userId;
    const taskId = req.params.taskId;
    
    if(!taskId)
      return handleError(res, "Invalid request, taskId is undefined")

    const user = await userModel.findById(userId)

    const { tasks, order } = user.tasks;

    const taskIndex = await tasks.findIndex(task => task._id.toString() === taskId)
    if(taskIndex < 0) {
      console.log('task index:', taskIndex, 'task id:', taskId, 'tasks:', tasks)
      return res.status(400).json({
        status: "error",
        message: "task with id not found, could not delete",
        data: null
      })
    }
    else console.log('taskIndex:', taskIndex)

    user.tasks.tasks.splice(taskIndex, 1);
    
    let responseMessage = "Successfully removed your task"
    
    const foundOrderIndex = order.indexOf(taskId)
    if(foundOrderIndex < 0) {
      console.log('id not found in the order. Skipping...') // dev only or??
      message = "deleted task, but the order was not modified. task was not in the original order?"
    }
    else
      user.tasks.order.splice(foundOrderIndex, 1)

    try {
      const updatedUser = await user.save();
      console.log('updated user after delete:', updatedUser)
      res.status(200).json({
        status: "success",
        message: responseMessage,
        data: {order: user.tasks.order}
      })
    } catch (err) {
      console.log('error updating user in DELETE /tasks:', err)
      next();
    }
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
}

  //   // find user
  //   let userResult = await findUser(userId)
  //   if(!userResult) next();

  //   // const tasks = userResult.tasks.tasks;

  //   // build updates
  //   const taskKeys = Object.keys(taskData);
  //   let setMongooseTask = {};

  //   let result = await Object.keys(taskData).map(key => {
  //     let newKey = "tasks.$." + key;
  //     setMongooseTask[newKey] = taskKeys[key];
  //   })
  //   console.log('result:', result)
  //   console.log('mongoose task updated object:', setMongooseTask)
  //   try {
  //     const updateResult = await userResult.update({'tasks.tasks._id': taskId}, {'$set': setMongooseTask}, function(err, result) {
  //       if(err) next();
  //       return result;
  //     }).lean()
  //     console.log('update result:', updateResult)

  //   } catch(error) {
  //     console.log('error updating task:', error)
  //     res.status(400).json({ status: 'error', message: error.toString(), data: null })
  //   }
    // find task;
    // const foundTask = await tasks.find(task => task._id === taskId)
    // if(!foundTask) {
    //   console.log('found task:', foundTask)
    //   return next(); // or return custom error
    // }

    // const taskIndex = await tasks.findIndex(task => task._id.toString() === taskId) // can i use findById method on this?
    // if(taskIndex < 0) {
    //   console.log('task index:', taskIndex)
    //   return next();
    // }

    // console.log('task before update:', tasks[taskIndex], 'task data:', taskData)
    // const newTask = Object.assign({}, tasks[taskIndex], taskData)
    // console.log('task after update:', newTask)

    // userResult.tasks.tasks.splice(taskIndex, 1, newTask)
  
    // try {
    //   // const updatedUser = await userResult.save()
    //   // console.log("updated user:", updatedUser)
    //   res.status(200).json({
    //     status: "success",
    //     message: "updated your task",
    //     data: {taskData: userResult.update}
    //   })
    // } catch (err) {
    //   console.log('error updating user:', err)
    //   next();

        // userModel.findOne({"_id": userId }).lean().exec()
    //   .then(async user => {
    //     if(!user) return next();
    //     const foundIndex = await user.tasks.tasks.findIndex(task => task._id.toString() === taskId)
    //     if(foundIndex < 0) return res.status(400).json({ status: "error", message: "task not found by id", data: null})
    //     const newTask = {...user.tasks.tasks[foundIndex], ...taskData}
    //     try {
    //       // BlogPost.findById(req.params.postId, function(err, post) {
    //       //   var subDoc = post.comments.id(req.params.commentId);
    //       //   subDoc.set(req.body);
          
    //       //   // Using a promise rather than a callback
    //       //   post.save().then(function(savedPost) {
    //       //     res.send(savedPost);
    //       //   }).catch(function(err) {
    //       //     res.status(500).send(err);
    //       //   });
    //       // });
    //       const result = await userModel.updateOne(
    //         {
    //           _id: mongoose.Types.ObjectId(userId),
    //           "tasks.tasks._id": mongoose.Types.ObjectId(taskId)
    //         },
    //         { "$set": { "tasks.$": newTask } }
    //       )
    //       console.log("result:", result)
    //       res.status(200).json({ status: "success", message: "updated your task", data: {taskData: newTask}})
    //     } catch(error) {
    //       console.log('error updating:', error)
    //       res.status(400).json({ status: "error", message: error.toString(), data: null })
    //     }
    //   })
    //   .catch(err => {
    //     console.log('error updating task:', err)
    //     res.status(400).json({ status: 'error', message: err.toString(), data: null })
    //   })