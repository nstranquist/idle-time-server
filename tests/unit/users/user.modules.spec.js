// test all modules
import { expect } from 'chai';
import sinon from 'sinon';
import UserService from '../../../src/services/UserService';
import * as userController from '../../../src/controllers/user.controller';
import UserModel from '../../../src/models/user.model';

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
  });
  it('should load user controller', () => {
    serviceMock = sinon.mock(serviceMock);
    expect(userController).to.be.a('object');
    expect(userController.authenticate).to.be.a('function');
    expect(userController.create).to.be.a('function');
    expect(userController.resetPassword).to.be.a('function');
  });
});
