const chai = require('chai');

const { expect } = chai;
const ProjectService = require('../../../src/services/ProjectService');
const ProjectController = require('../../../src/controllers/project.controller');
const UserModel = require('../../../src/models/user.model');
const ProjectModel = require('../../../src/models/project.model');

describe('Project Module', () => {
  it('should load ProjectService', () => {
    expect(ProjectService).to.be.a('function');
    const projectService = new ProjectService(UserModel, ProjectModel);
    expect(projectService).to.be.a('object');
    expect(projectService.createProject).to.be.a('function');
    expect(projectService.getSummaries).to.be.a('function');
    expect(projectService.getProject).to.be.a('function');
    expect(projectService.findUserById).to.be.a('function');
    // add more
  });
  it('should load ProjectController', () => {
    expect(ProjectController).to.be.a('object');
    expect(ProjectController.getProjectSummaries).to.be.a('function');
    expect(ProjectController.getProject).to.be.a('function');
    expect(ProjectController.createProject).to.be.a('function');
    expect(ProjectController.updateProjectDetails).to.be.a('function');
    expect(ProjectController.deleteProject).to.be.a('function');
  });
});
