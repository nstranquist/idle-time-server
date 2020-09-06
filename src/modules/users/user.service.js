/* eslint-disable class-methods-use-this */
const UserModel = require('./user.model');

class UserService {
  // manual dependency injection
  constructor(userModel) {
    this.userModel = userModel;
  }

  async findUserById(id) {
    const user = await this.userModel.findById(id);
    return user;
  }

  async createUser(user) {
    if (this.validate(user)) {
      const userRecord = await UserModel.create(user);
      return userRecord;
    }
    return { ok: false, message: 'User could not be validated' };
  }

  validate(user) {
    if (user.name && user.email && user.password) return true;

    return false;
  }
}

module.exports = UserService;
