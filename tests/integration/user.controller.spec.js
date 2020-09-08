// const axios = require('axios');
// const chai = require('chai');
const request = require('supertest');
const MongoService = require('../../src/lib/db');
const app = require('../../src/app');
const initConfig = require('../../src/config');
const { expect } = require('../setup');
require('dotenv').config();

const config = initConfig();

describe('User Controller', () => {
  // TODO: move hooks to ;`test_helper.js`
  after(() => {
    MongoService.dropTestDb('users');
    MongoService.resetMongoose();
    return MongoService.close();
  });

  describe('POST /auth/signup', () => {
    let newUserData;
    const name = 'nico';
    const email = 'nicostran6@gmail.com';
    const password = 'demodemo1';
    const invalidEmail = 'nicostran6';
    const shortPassword = 'demo';
    const weakPassword = 'demodemo';

    it('should create new user', done => {
      newUserData = `name=${name}&email=${email}&password=${password}`;
      request(app(config))
        .post('/v1/auth/signup')
        .send(newUserData)
        .set({ Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(201);
          expect(res.body.message).to.equal('User created successfully');
          return done();
        });
    });

    it('should fail with invalid email', done => {
      newUserData = `name=${name}&email=${invalidEmail}&password=${password}`;
      request(app(config))
        .post('/v1/auth/signup')
        .send(newUserData)
        .set({ Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(400);
          expect(res.body.message).to.equal('"email" must be a valid email');
          return done();
        });
    });

    it('should fail with short password', done => {
      newUserData = `name=${name}&email=${email}&password=${shortPassword}`;
      request(app(config))
        .post('/v1/auth/signup')
        .send(newUserData)
        .set({ Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(400);
          expect(res.body.message).to.equal('password must be at least 8 characters');
          return done();
        });
    });

    it('should fail with weak password', done => {
      newUserData = `name=${name}&email=${email}&password=${weakPassword}`;
      request(app(config))
        .post('/v1/auth/signup')
        .send(newUserData)
        .set({ Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(400);
          expect(res.body.message).to.equal('password must contain at least 1 letter and 1 number');
          return done();
        });
    });
  });

  describe('POST /auth/login', () => {
    let loginData;
    const email = 'nicostran6@gmail.com';
    const password = 'demodemo1';
    const invalidEmail = 'nicostran6';
    const wrongPassword = 'demodemo10';

    it('should login existing user successfully', done => {
      loginData = `email=${email}&password=${password}`;
      request(app(config))
        .post('/v1/auth/login')
        .send(loginData)
        .set({ Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(200);
          expect(res.body.message).to.equal('User logged in successfully');
          expect(res.body.data.token).to.be.a('string');
          return done();
        });
    });
    it('should fail with invalid email', done => {
      loginData = `email=${invalidEmail}&password=${password}`;
      request(app(config))
        .post('/v1/auth/login')
        .send(loginData)
        .set({ Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(400);
          expect(res.body.message).to.equal('"email" must be a valid email');
          return done();
        });
    });
    it('should fail with wrong password', done => {
      loginData = `email=${email}&password=${wrongPassword}`;
      request(app(config))
        .post('/v1/auth/login')
        .send(loginData)
        .set({ Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.statusCode).to.equal(404);
          expect(res.body.message).to.equal('Invalid password');
          return done();
        });
    });
  });

  // describe('POST /auth/reset-password', () => {
  //   let email = "nicostran6@gmail.com"
  //   let nonexistentEmail="nicostran10@gmail.com"
  //   let invalidEmail="nicostran6"

  //   it('should fail with invalid email', done => {
  //     request(app(config))
  //       .post('/v1/auth/reset-password')
  //       .send(`email=${invalidEmail}`)
  //       .set({ Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' })
  //       .end((err, res) => {
  //         if (err) return done(err);
  //         expect(res.statusCode).to.equal(400);
  //         expect(res.body.message).to.equal('"email" is not a valid email');
  //         return done();
  //       });
  //   })
  // })
});
