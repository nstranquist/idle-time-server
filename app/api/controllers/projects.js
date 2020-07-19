const userModel = require('../models/users')
const findUser = require('../utils/findUser')
const findUserProperty = require('../utils/findUserProperty')

module.exports = {
  getAll: async (req, res, next) => {
    const userId = req.body.userId;
    try {
      const userInfo = await findUserProperty(userId, "projects", next)
      if(!userInfo.ok) next();
      else {
        console.log('user info:', userInfo)
        const { projects } = userInfo.result;
        console.log('projects:', projects)
        res.status(200).json({ status: "success", message: "found your projects", data: { projects } })
      }
    } catch (error) {
      throw new Error(error.toString())
    }
  },
  addOne: async (req, res, next) => {
    const userId = req.body.userId;
    const project = req.body.project;

    if(!project) next();

    try {
      const user = await findUser(userId)
      if(!user) return next()
      
      const length = user.projects.length;
      console.log('project length:', length)
      user.projects.push(project)
      const updatedUser = await user.save();
      console.log('updated user projects:', updatedUser.projects);
      res.status(200).json({ status: "success", message: "updated user projects", data: { project: updatedUser.projects[length] }})
    } catch(error) {
      console.log('error:', error)
      throw new Error(error.toString())
    }
  },
  updateOne: async (req, res, next) => {
    const userId = req.body.userId;
    const projectData = req.body.project;
    const projectId = req.params.id;

    try {
      const user = await findUser(userId);
      if(!user) return next();

      const project = await user.projects.id(projectId);
      if(!project) next();

      project.set(projectData)

      const result = await user.save();
      console.log("result:", result)
      res.status(200).json({ status: "success", message: "updated your project", data: { project }})
    } catch (error) {
      console.log('error:', error)
      throw new Error(error.toString())
    }
  },
  deleteOne: async ( req, res, next) => {
    const userId = req.body.userId;
    const projectId = req.params.id;

    try {
      const user = await findUser(userId)
      if(!user) return next()
      
      const foundIndex = await user.projects.findIndex(project => project._id.toString() === projectId)
      if(foundIndex < 0) return next();

      user.projects.splice[foundIndex, 1];

      const updatedUser = await user.save();
      console.log('updated user projects:', updatedUser.projects);

      res.status(200).json({ status: "success", message: "updated user projects", data: { id: projectId }})
    } catch(error) {
      console.log('error:', error)
      throw new Error(error.toString())
    }
  }
}