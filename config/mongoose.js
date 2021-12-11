const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/college_hawk_development');

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Error connecting to DB (See config)"));

db.once('open', function () {
    // callback fn
    console.log('   Connected to DB :: MongoDB');
});

module.exports = db;