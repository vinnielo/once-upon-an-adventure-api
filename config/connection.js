const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error('MONGODB_URI environment variable must be set');
}

mongoose.connect(mongoUri);

module.exports = mongoose.connection;

