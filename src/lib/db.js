const mongoose = require('mongoose');

// eslint-disable-next-line max-len
module.exports.connect = async (connectionString) => mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
