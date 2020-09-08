const supertest = require('supertest');
const MongoService = require('../../src/lib/db');
const initConfig = require('../../src/config');
const app = require('../../src/app');
const { expect } = require('../setup');
// const UserModel = require('../../src/models/user.model');
// const UserService = require('../../src/services/UserService');
// const UserController = require('../../src/controllers/user.controller');

const config = initConfig();

describe('ProjectController', () => {
  let agent;
  let userToken;
  let userData;
  let projectData;
  const mockUser = { name: 'Nico', email: 'mockpassword@gmail.com', password: 'mockpassword1' };

  before(() => {
    agent = supertest.agent(app(config));
  });
  beforeEach(done => {
    // const userService = new UserService(UserModel);
    if (!userToken || !userData) {
      agent
        .post('/v1/auth/signup')
        .send(mockUser)
        .set({ Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' })
        .end((err, res) => {
          if (err) done(err);
          console.log('mock signup:', res.body.message);
          agent
            .post('/v1/auth/login')
            .send({ email: mockUser.email, password: mockUser.password })
            .set({ Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' })
          // eslint-disable-next-line no-shadow
            .end((err, res) => {
              if (err) done(err);
              console.log('mock login:', res.body.message);
              userData = res.body.data.userData;
              userToken = res.body.data.token;
              done();
            });
        });
    } else done();
  });
  after(() => {
    // TODO: more efficient command than to drop the database. Just clear the created users
    MongoService.dropTestDb('users');
    MongoService.resetMongoose();
    return MongoService.close();
  });

  describe('POST /projects', () => {
    const mockNewProject = {
      title: 'new project title',
      desc: 'description',
    };
    it('should create a new project', done => {
      agent
        .post('/v1/projects')
        .set({ 'x-access-token': userToken })
        .send({ ...mockNewProject })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.ok).to.equal(true);
          expect(res.statusCode).to.equal(201);
          expect(res.body.message).to.equal('Project created successfully');
          expect(res.body.project).to.deep.include(mockNewProject);
          projectData = res.body.project;
          return done();
        });
    });
    it('should fail to create a project with extranneous data', done => {
      agent
        .post('/v1/projects')
        .set({ 'x-access-token': userToken })
        .send({ ...mockNewProject, random: 'random' })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.ok).to.equal(false);
          expect(res.statusCode).to.equal(400);
          expect(res.body.message).to.include('is not allowed');
          return done();
        });
    });
  });

  describe('GET /projects', () => {
    it('should get project summaries', done => {
      agent
        .get('/v1/projects')
        .set({ 'x-access-token': userToken })
        .send()
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.ok).to.equal(true);
          expect(res.statusCode).to.equal(200);
          expect(res.body.message).to.equal('Found user projects');
          expect(res.body.projects).to.be.a('array');
          expect(res.body.projects.length).to.be.greaterThan(0);
          return done();
        });
    });
  });

  describe('GET /projects/:id', () => {
    const fakeProjectId = '5f57a3e05c9faa702a613f76';

    it('should get project details', done => {
      agent
        .get(`/v1/projects/${projectData._id}`)
        .set({ 'x-access-token': userToken })
        .send()
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.ok).to.equal(true);
          expect(res.statusCode).to.equal(200);
          expect(res.body.message).to.be.equal('Found user project');
          expect(res.body.project).to.be.a('object');
          return done();
        });
    });
    it('should fail to get project with invalid id', done => {
      agent
        .get(`/v1/projects/${fakeProjectId}`)
        .set({ 'x-access-token': userToken })
        .send()
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.ok).to.equal(false);
          expect(res.statusCode).to.equal(400);
          expect(res.body.message).to.equal('Could not find user project');
          expect(res.body.project).to.be.a('undefined');
          return done();
        });
    });
  });

  // describe('DELETE /projects/:id', () => {
  //   it('should delete a project', done => {
  //     agent
  //       .delete(`/v1/projects/${projectData._id}`)
  //       .set({ 'x-access-token': userToken })
  //       .send()
  //       .end((err, res) => {
  //         if(err) done(err)
  //         console.log(res.body)
  //         expect(res.statusCode).to.equal(204)
  //         expect(res.body.message).to.equal('Project removed successfully')
  //       })
  //   }
  // })
});
