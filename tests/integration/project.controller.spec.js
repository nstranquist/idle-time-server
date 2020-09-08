const supertest = require('supertest');
const MongoService = require('../../src/lib/db');
const initConfig = require('../../src/config');
const app = require('../../src/app');
const { expect } = require('../setup');
// const UserModel = require('../../src/models/user.model');
// const UserService = require('../../src/services/UserService');
const UserController = require('../../src/controllers/user.controller');

const config = initConfig();

describe('ProjectController', () => {
  let userData;
  let userToken;
  let agent;
  const mockUser = { name: 'Nico', email: 'mockpassword@gmail.com', password: 'mockpassword1' };

  before(() => {
    agent = supertest.agent(app(config));
  });
  beforeEach(done => {
    // const userService = new UserService(UserModel);
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
        .set({ 'x-access-token': userToken, Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' })
        .send({ ...mockNewProject })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.ok).to.equal(true);
          expect(res.statusCode).to.equal(201);
          expect(res.body.message).to.equal('Project created successfully');
          expect(res.body.project).to.deep.include(mockNewProject);
          return done();
        });
    });
  });
});
