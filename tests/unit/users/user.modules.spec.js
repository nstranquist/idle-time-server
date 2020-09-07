// test all modules
const { expect } = require('chai');
const sinon = require('sinon');
const UserService = require('../../../src/services/UserService');
const userController = require('../../../src/controllers/user.controller');
const UserModel = require('../../../src/models/user.model');

let modelMock;
let serviceMock;

describe('User Modules', () => {
  afterEach(() => {
    modelMock = undefined;
    serviceMock = undefined;
  });
  it('should load user service', () => {
    modelMock = sinon.mock(UserModel);
    const userService = new UserService(modelMock);
    expect(UserService).to.be.a('function');
    expect(userService).to.be.a('object');
    expect(userService.compareUserPassword).to.be.a('function');
    expect(userService.createUser).to.be.a('function');
    expect(userService.ensureUniqueEmail).to.be.a('function');
    expect(userService.findUserByEmail).to.be.a('function');
    expect(userService.findUserById).to.be.a('function');
  });
  it('should load user controller', () => {
    serviceMock = sinon.mock(serviceMock);
    expect(userController).to.be.a('object');
    expect(userController.authenticate).to.be.a('function');
    expect(userController.create).to.be.a('function');
    expect(userController.resetPassword).to.be.a('function');
  });
});
