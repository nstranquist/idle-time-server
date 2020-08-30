const chai = require('chai');

const { expect } = chai;

const { connect } = require('../../../server/lib/db');

describe('mongodb.connect', () => {
  it('should return a function', () => {
    expect(connect).to.be.a('function');
  });
  // it.skip('should connect to database', () => {

  // });
});
