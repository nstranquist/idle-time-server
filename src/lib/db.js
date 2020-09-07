const mongoose = require('mongoose');

// eslint-disable-next-line max-len
module.exports.connect = async (connectionString) => mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports.close = () => mongoose.connection.close();

module.exports.resetMongoose = () => {
  mongoose.models = {};
  mongoose.modelSchemas = {};
};

module.exports.dropTestDb = (collectionName) => {
  const dbName = mongoose.connection.name;
  if (dbName && dbName === 'test') {
    // proceed
    mongoose.connection.collections[collectionName].drop((err) => {
      if (err) console.log('error dropping collection:', collectionName, 'from db:', err);
    });
  }
};
