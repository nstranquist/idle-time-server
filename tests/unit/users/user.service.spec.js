/* eslint-disable no-underscore-dangle */
const chai = require('chai');
// const sinon = require('sinon');
const MongoService = require('../../../src/lib/db');
const { dbConnectionTest } = require('../../setup');
require('../../fixtures/sinon-mongoose');

const { expect } = chai;
const UserService = require('../../../src/services/UserService');
const UserModel = require('../../../src/models/user.model');

const { UserFixture, /* ErrorFixture */ } = require('../../fixtures');

// let UserModelMock;

describe('User Service', () => {
  let userService;
  let userResult;
  const mockUser = { name: 'Nico', email: 'example@gmail.com', password: 'demodemo1' };

  beforeEach(async () => {
    await MongoService.connect(dbConnectionTest)
      .catch(err => console.log('[testing] error connecting to db:', err));
    userService = new UserService(UserModel);
    userResult = await userService.createUser(mockUser);
    // UserModelMock = sinon.mock(UserModel);
  });
  afterEach(() => {
    // UserModelMock.restore();
    MongoService.resetMongoose();
    return MongoService.close();
  });

  describe('createUser', () => {
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
    // idk how to write error case for this, since data is already getting validated
    // since email is already checked, there shouldn't be any problems for duplicates
  });

  describe('findUserById', () => {
    const nomatchId = '5f55b0ee2b9ade00113504af';
    const invalidId = 'dkfjldkfjsdkfjds';

    it('should find user when given an id', async () => {
      try {
        const result = await userService.findUserById(userResult._id);
        expect(result).to.be.a('object');
        expect(JSON.stringify(userResult)).to.deep.equal(JSON.stringify(result));
      } catch (error) {
        expect.fail(error);
      }
    });
    it('should fail to find user given an id that doesn\'t match', async () => {
      try {
        const result = await userService.findUserById(nomatchId);
        if (!result.error) expect.fail('User should not be found with an id that doesn\'t match');
        expect(result.error).to.be.equal(true);
        expect(result.message).to.be.equal('Could not find a user with the given id');
      } catch (error) {
        expect.fail(error);
      }
    });
    it('should fail to find user given an invalid user id', async () => {
      try {
        const result = await userService.findUserById(invalidId);
        if (!result.error) expect.fail('User should not be found with an invalid id');
        expect(result.error).to.be.equal(true);
        expect(result.message).to.be.equal('Invalid user id');
      } catch (error) {
        expect.fail(error);
      }
    });
  });

  describe('comparePassword', () => {
    const fakePassword = 'fakepassword';

    it('should validate matching passwords', async () => {
      try {
        const result = await userService.compareUserPassword(mockUser.password, userResult.password);
        if (result.error) expect.fail(result.error);
        expect(result.json).to.be.a('object');
        expect(result.json.message).to.equal('User logged in successfully');
      } catch (error) {
        expect.fail(error);
      }
    });
    it('should fail to validate passwords that don\'t match', async () => {
      try {
        const result = await userService.compareUserPassword(fakePassword, userResult.password);
        if (!result.error) expect.fail('passwords that don\'t match should not be validated');
        expect(result.error).to.equal(true);
        expect(result.statusCode).to.equal(404);
        expect(result.json.message).to.equal('Invalid password');
      } catch (error) {
        expect.fail(error);
      }
    });
  });

  describe('findUserByEmail', () => {
    const incorrectEmail = 'noone@gmail.com';

    it('should find user by email', async () => {
      try {
        const result = await userService.findUserByEmail(mockUser.email);
        if (result.error) expect.fail(result);
        expect(result).to.be.a('object');
        const leanResult = { name: result.name, email: result.email };
        const leanUserResult = { name: userResult.name, email: userResult.email };
        expect(JSON.stringify(leanResult)).to.deep.equal(JSON.stringify(leanUserResult));
      } catch (error) {
        expect.fail(error);
      }
    });
    it('should fail to find user by incorrect email', async () => {
      try {
        const result = await userService.findUserByEmail(incorrectEmail);
        if (!result.error) expect.fail('should throw error for incorrect email');
        expect(result.json).to.be.a('object');
        expect(result.json.message).to.equal('User not found');
      } catch (error) {
        expect.fail(error);
      }
    });
  });

  describe('ensureUniqueEmail', () => {
    const uniqueEmail = 'uniqueemail@gmail.com';

    beforeEach(async () => {
      userResult = await userService.createUser(mockUser);
      return userResult;
    });

    it('should return true if email is unique', async () => {
      try {
        const result = await userService.ensureUniqueEmail(uniqueEmail);
        if (!result) expect.fail('unique email should return true');
        expect(result).to.equal(true);
      } catch (error) {
        expect.fail(error);
      }
    });
    it('should return false if email is not unique', async () => {
      try {
        const result = await userService.ensureUniqueEmail(mockUser.email);
        if (result) expect.fail('taken email should return false');
        expect(result).to.equal(false);
      } catch (error) {
        expect.fail(error);
      }
    });
  });
});
