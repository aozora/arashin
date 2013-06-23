exports = mongoose = require('mongoose');
console.log('Db url: ' + config.db.uri);

// connect to mongodb
mongoose.connect(config.db.uri);

// Check connection to mongoDB
mongoose.connection.on('open', function() {
   console.log('mongodb connected!');
});

exports = Schema = mongoose.Schema;
