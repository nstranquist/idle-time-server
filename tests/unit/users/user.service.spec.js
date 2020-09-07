/* eslint-disable no-underscore-dangle */
const chai = require('chai');
const sinon = require('sinon');
const MongoService = require('../../../src/lib/db');
const { dbConnectionTest } = require('../../setup');
require('../../fixtures/sinon-mongoose');

const { expect } = chai;
const UserService = require('../../../src/services/UserService');
const UserModel = require('../../../src/models/user.model');

const { UserFixture, /* ErrorFixture */ } = require('../../fixtures');

let UserModelMock;

describe('User Service', () => {
  beforeEach(async () => {
    await MongoService.connect(dbConnectionTest)
      .catch(err => console.log('[testing] error connecting to db:', err));
    UserModelMock = sinon.mock(UserModel);
  });
  afterEach(() => {
    UserModelMock.restore();
    MongoService.resetMongoose();
    return MongoService.close();
  });
  describe('createUser', () => {
    // eslint-disable-line one-var-declaration-per-line
    let newUser;
    let expectedUserResult;
    // let expectedError;

    it('should create a user and add to database', async () => {
      newUser = UserFixture.newUser;
      expectedUserResult = UserFixture.createdUser;

      // UserModelMock.expects('create')
      //   .withArgs(newUser)
      //   .resolves(expectedUserResult);

      try {
        const userService = new UserService(UserModel);
        const result = await userService.createUser(newUser);
        expect(result).to.be.a('object');
        const {
          name, email, projects, presets, timelogs, tasks, archives, status
        } = result;
        const leanResult = {
          name, email, projects, presets, timelogs, tasks, archives, status
        };
        expect(JSON.stringify(leanResult)).to.deep.equal(JSON.stringify(expectedUserResult));
      } catch (error) {
        expect.fail(error);
      }
    });
  });
  describe('findUserById', () => {
    it('should find user when given an id', async () => {
      const mockUser = {
        name: 'Nico', email: 'example@gmail.com', password: 'demodemo1'
      };
      try {
        const userResult = await new UserModel(mockUser).save();
        const userService = new UserService(UserModel);
        const result = await userService.findUserById(userResult._id);
        expect(result).to.be.a('object');
        expect(JSON.stringify(userResult)).to.deep.equal(JSON.stringify(result));
      } catch (error) {
        expect.fail(error);
      }
    });
  });
});
