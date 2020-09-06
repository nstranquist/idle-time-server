/* eslint-disable no-underscore-dangle */
const chai = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
require('../../fixtures/sinon-mongoose');
const MongoService = require('../../../src/lib/db');

const { expect } = chai;
const UserService = require('../../../src/modules/users/user.service');
const UserModel = require('../../../src/modules/users/user.model');

const { UserFixture, ErrorFixture } = require('../../fixtures');

let UserModelMock;

describe('User Service', () => {
  beforeEach(() => {
    MongoService.connect('mongodb://localhost:27017/idle_time_db')
      .then(() => {})
      .catch((error) =>
        console.log('[testing] error connecting to db:', error)
      );
    UserModelMock = sinon.mock(UserModel);
  });
  afterEach(() => {
    UserModelMock.restore();
    mongoose.models = {};
    mongoose.modelSchemas = {};
    return mongoose.connection.close();
  });
  describe('createUser', () => {
    // eslint-disable-line one-var-declaration-per-line
    let newUser;
    let expectedUserResult;
    let expectedError;

    it('should create a user and add to database', async () => {
      newUser = UserFixture.newUser;
      expectedUserResult = UserFixture.createdUser;

      UserModelMock.expects('create')
        .withArgs(newUser)
        .resolves(expectedUserResult);

      try {
        const userService = new UserService(UserModelMock);
        const result = await userService.createUser(newUser);
        expect(result).to.be.a('object');
        const leanResult = {
          name: result.name,
          email: result.email,
          projects: result.projects,
          presets: result.presets,
          timelogs: result.timelogs,
          tasks: result.tasks,
          archives: result.archives,
          status: result.status,
        };
        expect(leanResult).to.deep.equal(expectedUserResult);
        // expect(result)
      } catch (error) {
        expect.fail(error);
      }
    });
    it.skip('should throw error with bad user data', () => {});
  });
});
