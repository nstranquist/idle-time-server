const chai = require('chai');
const MongoService = require('../../../src/lib/db');
const { dbConnectionTest } = require('../../setup');

const { expect } = chai;
const ProjectService = require('../../../src/services/ProjectService');
const ProjectModel = require('../../../src/models/project.model');
const UserModel = require('../../../src/models/user.model');
const UserService = require('../../../src/services/UserService');

const mockUser = {
  name: 'Nico',
  email: 'mockuser@gmail.com',
  password: 'mockpassword'
};
const mockProject = { // make mockProjects[]
  title: 'project title',
  desc: 'project description',
};
const mockCreatedProject = {
  tasks: [],
  isBillable: false,
  isActive: true,
  title: mockProject.title,
  desc: mockProject.desc,
};
const fakeUserId = '5f56f7812a00b429adeacdc2';

describe('ProjectService', () => {
  let projectService;
  let userService;
  let userResult;

  beforeEach(async () => {
    if (!projectService) projectService = new ProjectService(UserModel, ProjectModel);
    if (!userService) userService = new UserService(UserModel);
    if (!MongoService.isConnected()) {
      await MongoService.connect(dbConnectionTest)
        .catch(err => console.log('[testing] error connecting to db:', err));
    }
    if (!userResult) userResult = await userService.createUser(mockUser);
  });
  // eslint-disable-next-line consistent-return
  afterEach(() => {
    if (!MongoService.isConnected) {
      MongoService.resetMongoose();
      return MongoService.close();
    }
  });

  describe('createProject(userId, project)', () => {
    it('should create project', async () => {
      try {
        const projectResult = await projectService.createProject(userResult._id, mockProject);
        expect(projectResult).to.be.a('object');
        expect(projectResult.message).to.be.equal('Project created successfully');
        expect(projectResult.project).to.deep.include(mockCreatedProject);
      } catch (error) {
        expect.fail(error);
      }
    });
  });

  describe('getSummaries(userId)', () => {
    it('should get project summaries', async () => {
      try {
        const summaries = await projectService.getSummaries(userResult._id);
        if (summaries.error) expect.fail(summaries);
        expect(summaries.message).to.equal('Found user projects');
        expect(summaries.projects).to.be.a('array');
      } catch (error) {
        expect.fail(error);
      }
    });
    it('should fail with invalid user id', async () => {
      try {
        const summaries = await projectService.getSummaries(fakeUserId);
        if (!summaries.error) expect.fail('error should be thrown with invalid user id');
        expect(summaries.error).to.equal(true);
        expect(summaries.json.message).to.equal('Could not find user by the given id');
      } catch (error) {
        expect.fail(error);
      }
    });
  });

  describe('updateProject()', () => {

  });
  describe('deleteProject()', () => {

  });
  describe('findUserById(id)', () => {
    it('should find user with the correct id', async () => {
      try {
        const userData = await projectService.findUserById(userResult._id);
        if (userData.error) expect.fail(userData);
        expect(userData).to.be.a('object');
        expect(userData.name).to.be.a('string');
        expect(userData.tasks.tasks).to.be.a('array');
      } catch (error) {
        expect.fail(error);
      }
    });
    it('should throw error with incorrect id', async () => {
      try {
        const userData = await projectService.findUserById(fakeUserId);
        if (!userData.error) expect.fail('should throw error with invalid id');
        expect(userData.error).to.equal(true);
        expect(userData.json.message).to.equal('Could not find user by the given id');
      } catch (error) {
        expect.fail(error);
      }
    });
  });
});
