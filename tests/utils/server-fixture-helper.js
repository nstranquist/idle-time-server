const {
  before, beforeEach, afterEach, after,
} = require('mocha');
require('dotenv').config();

const APP_PORT = process.env.PORT || 8080;
const { DB_PORT } = process.env;

function setupTest(test) {
  const timeout = 5000;

  test.timeout(timeout);

  before(async () => {
    await start(APP_PORT, DB_PORT, {
      debug: true,
    });
  });

  beforeEach(async () => {
    await removeExistingData();
    await restoreDatabase();
  });

  afterEach(async () => {

  });

  after(async () => {
    await stop();
  });
}

module.exports = {
  setupTest,
};
