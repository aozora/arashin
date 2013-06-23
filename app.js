/* Main application entry file. Please note, the order of loading is important.
 * Configuration loading and booting of controllers and custom error handlers */
console.log('start');
console.log('ENV: ' + process.env.NODE_ENV);

var express = require('express')
   ,fs = require('fs')
   ,utils = require('./utils/utils')
   ,auth = require('./lib/authorization')
   ,http = require('http');


// Load configurations
exports = module.exports = config = require('./config').config();
console.log('config: ok');

// init authentication strategies
require('./lib/authentication');
console.log('require authentication: ok');

// init db connection
require('./lib/db-connect');
console.log('require db-connect: ok');

// Bootstrap models
var models_path = __dirname + '/app/models'
   ,model_files = fs.readdirSync(models_path);

model_files.forEach(function (file) {
   if (file == 'user.js')
      User = require(models_path + '/' + file);
   else if (file !== '.svn')
      require(models_path + '/' + file);
});
console.log('models: ok');


// express 3.x app
var app = express();

// Bootstrap application settings
require('./settings').boot(app);
console.log('settings boot: ok');


// Bootstrap controllers
var controllers_path = __dirname + '/app/controllers'
   ,controller_files = fs.readdirSync(controllers_path);

controller_files.forEach(function (file) {
   if (file !== '.svn')
      require(controllers_path + '/' + file)(app, auth);
});
console.log('controllers: ok');



//require('./error-handler').boot(app);   // Bootstrap custom error handler
//console.log('error-handler boot: ok');



// Start the app by listening on <port>
var port = process.env.PORT || 3000;
//app.listen(port);
http.createServer(app).listen(port);
console.log('Express app started on port ' + port);
