import mongoose from 'mongoose';
import { server, BASE_URL, expect } from '../setup';

describe('User Controller', () => {
  beforeEach(() => {

  });
  afterEach(() => {

  });
  describe('POST /auth/signup', () => {
    it.skip('should create new user', done => {
      server
        .post(`${BASE_URL}/auth/signup`)
        .expect(201)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.mesage).to.equal('User created successfully');
          done();
        });
    });
  });
});
