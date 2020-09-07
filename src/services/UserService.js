/* eslint-disable class-methods-use-this */
const bcrypt = require('bcrypt');

class UserService {
  constructor(UserModel) {
    this.UserModel = UserModel;
  }

  // returns true if found, false if not
  async ensureUniqueEmail(email) {
    try {
      const foundUser = await this.UserModel.findOne({ email }).exec();
      if (foundUser) return false;
      return true;
    } catch (error) {
      console.log('error:', error.toString());
      return false;
    }
  }

  // returns userData if found, error if not
  async findUserByEmail(email) {
    try {
      const userInfo = await this.UserModel.findOne({ email }).exec();
      if (userInfo) return userInfo;
      return {
        error: true,
        statusCode: 400,
        json: { ok: false, message: 'User not found' }
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 400,
        json: { ok: false, message: error.toString() }
      };
    }
  }

  async compareUserPassword(candidatePassword, password) {
    if (bcrypt.compareSync(candidatePassword, password)) {
      return { json: { ok: true, message: 'User logged in successfully' } };
    }
    return {
      error: true,
      statusCode: 404,
      json: { ok: false, message: 'Invalid password' }
    };
  }

  // returns user if found, error if not
  async findUserById(id) {
    try {
      const user = await this.UserModel.findById(id);
      if (user) return user;
      return { error: true, message: 'Could not find a user with the given id' };
    } catch (error) {
      let message = error.toString();
      if (message[0] === 'C' && message[1] === 'a') message = 'Invalid user id';
      return {
        error: true,
        message // will need to understand what type of errors can be thrown and translate
      };
    }
  }

  // user should contain name, email, password
  async createUser(user) {
    try {
      const userRecord = await new this.UserModel(user).save();
      return userRecord;
    } catch (error) {
      return {
        error: true,
        statusCode: 400,
        json: { ok: false, message: error.toString() }
      };
    }
  }
}

module.exports = UserService;
