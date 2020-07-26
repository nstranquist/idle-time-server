function setupTest(test) {
  const timeout = 5000

  test.timeout(timeout)

  before(async () => {
    await start(APP_PORT, DB_PORT, {
      debug: true,
    })
  })

  beforeEach(async () => {
    await removeExistingData()
    await restoreDatabase()
  })

  afterEach(async () => {

  })

  after(async () => {
    await stop()
  })
}

module.exports = {
  setupTest
}
