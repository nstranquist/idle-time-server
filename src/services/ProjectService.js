/* eslint-disable class-methods-use-this */

/**
 * Options:
 * - Can either pass the UserModel in here, and findById with an _id param,
 * - or, can pass in UserService reference to find by id
 * - well, how many UserService calls do I need?
 * - I just need to query fields by id
 * - Therefore, I will just require a userResponse
 * - But, I need to update the user model when updating a project.
 * - UserService is more of an Auth service right now
 * - ProjectService will still need to query User model.
 * - Except, it will only modify project-related items.
 * - To modify other data, it will have to invoke another service (as callback?)
 */
class ProjectService {
  constructor(UserModel, ProjectModel) {
    this.UserModel = UserModel;
    this.ProjectModel = ProjectModel;
  }

  async createProject(userId, project) {
    try {
      const userData = await this.findUserById(userId);
      if (userData.error) return userData;
      // TODO: create this project INSIDE of the user model
      userData.projects.push(project);
      const newProject = userData.projects.create(project);
      return { ok: true, message: 'Project created successfully', project: newProject };
    } catch (error) {
      console.log('error:', error);
      return { error: true, json: { ok: false, message: error.toString() } };
    }
  }

  // gets all projects[] inside of UserModel.projects
  async getSummaries(userId) {
    try {
      const userData = await this.findUserById(userId);
      if (userData.error) return userData;
      // get the projects from this user
      const { projects } = userData;
      // console.log('projects:', projects);
      return { ok: true, message: 'Found user projects', projects };
    } catch (error) {
      console.log('error:', error);
      return { error: true, json: { ok: false, message: error.toString() } };
    }
  }

  async getProject(userId, projectId) {
    try {
      const userData = await this.findUserById(userId);
      if (userData.error) return userData;
      // get the project from this user
      const foundProject = await userData.projects.find(project => project._id === projectId);
      console.log('foundProject:', foundProject);
      if (foundProject) return { ok: true, message: 'Found user project', project: foundProject };
      return { error: true, json: { ok: false, message: 'Could not find user project' } };
    } catch (error) {
      console.log('error:', error);
      return { error: true, json: { ok: false, message: error.toString() } };
    }
  }

  // Purposefully redundant for separation of concerns
  async findUserById(id) {
    try {
      const userData = await this.UserModel.findById(id);
      // console.log(userData);
      if (userData) return userData;
      return { error: true, json: { ok: false, message: 'Could not find user by the given id' } };
    } catch (error) {
      console.log('error:', error);
      return { error: true, json: { ok: false, message: error } };
    }
  }
}

module.exports = ProjectService;
