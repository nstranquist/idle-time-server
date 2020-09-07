// const request = require('supertest');
const chai = require('chai');
const sinonChai = require('sinon-chai');
// const app = require('../src/app');

chai.use(sinonChai);

const { expect } = chai;
// const server = supertest.agent(app);
const url = 'http://localhost:8080/v1';
const dbConnectionTest = 'mongodb://localhost:27017/idle_time_server';

module.exports = {
  expect, url, dbConnectionTest, // request,
};
