/* eslint-disable no-unused-vars */
const UserModel = require('../models/user.model');
const ProjectModel = require('../models/project.model');
const ProjectService = require('../services/ProjectService');

const getProjectSummaries = async (req, res, next) => {
  const { userId } = req.body;
  const projectService = new ProjectService(UserModel, ProjectModel);
  const response = await projectService.getSummaries(userId);
  if (response.error) return res.status(400).json(response.json);
  return res.status(200).json(response);
};

const getProject = async (req, res, next) => {
  const { userId } = req.body;
  const { id } = req.params;
  const projectService = new ProjectService(UserModel, ProjectModel);
  const response = await projectService.getProject(userId, id);
  if (response.error) return res.status(400).json(response.json);
  return res.status(200).json(response);
};

const createProject = async (req, res, next) => {
  const { userId } = req.body;
  delete req.body.userId;
  const projectService = new ProjectService(UserModel, ProjectModel);
  const response = await projectService.createProject(userId, req.body);
  if (response.error) return res.status(400).json(response.json);
  return res.status(201).json(response);
};

const deleteProject = async (req, res, next) => {
  const isArchive = req.query.archive;
  console.log('value of isArchive:', isArchive);
  next();
};

const updateProjectDetails = async (req, res, next) => {
  next();
};

module.exports = {
  getProjectSummaries,
  getProject,
  createProject,
  updateProjectDetails,
  deleteProject
};
