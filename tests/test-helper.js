const mongoose = require('mongoose')

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/test_idletime')
mongoose.connection
  .once('open', () => console.log('test db connected'))
  .on('error', (err) => console.warn("Error:", error))

beforeEach((done) => {
  mongoose.connection.collections.users.drop(() => {
    // returns after the drop is complete
    done()
  })
})