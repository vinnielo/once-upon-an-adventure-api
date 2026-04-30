const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://vinnielo001:password24@cluster0.ol3bz.mongodb.net/onceupon');

module.exports = mongoose.connection;

