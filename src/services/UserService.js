/* eslint-disable class-methods-use-this */
const bcrypt = require('bcrypt');

class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  // returns true if found, false if not
  async ensureUniqueEmail(email) {
    try {
      const foundUser = await this.userModel.findOne({ email }).exec();
      if (foundUser) return true;
      return false;
    } catch (error) {
      console.log('error:', error.toString());
      return false;
    }
  }

  // returns userData if found, error if not
  async findUserByEmail(email) {
    try {
      const userInfo = await this.userModel.findOne({ email }).exec();
      if (userInfo) {
        console.log('userinfo:', userInfo);
        return userInfo;
      }
      return {
        error: true,
        statusCode: 400,
        json: { status: 'error', message: 'User not found' }
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 400,
        json: { status: 'error', message: error.toString() }
      };
    }
  }

  async compareUserPassword(candidatePassword, password) {
    if (bcrypt.compareSync(candidatePassword, password)) {
      return { error: false, json: { status: 'success', message: 'Found user' } };
    }
    return {
      error: true,
      statusCode: 404,
      json: { status: 'error', message: 'Invalid password' }
    };
  }

  // returns user if found, error if not
  async findUserById(id) {
    try {
      const user = await this.userModel.findById(id);
      return user;
    } catch (error) {
      return {
        error: true,
        message: error.toString() // will need to understand what type of errors can be thrown and translate
      };
    }
  }

  // user should contain name, email, password
  async createUser(user) {
    try {
      const userRecord = await this.userModel.create(user);
      return userRecord;
    } catch (error) {
      return {
        error: true,
        statusCode: 400,
        json: { status: 'error', message: error.toString() }
      };
    }
  }
}

module.exports = UserService;
