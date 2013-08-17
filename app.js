/*
 * MuContent
 * 
 * Starting application with clustering for multicore CPUs
 * 
 */

// REQUIREMENTS
var fs = require('fs');
var cluster = require('cluster');
var Config = require('./config');
var express = require('express');
var app = express();
var utils = require('./lib/utils');
var parameters = require('./params');
var env = 'dev';
var root_path = process.cwd() ;

// Instance the configuration class
var configuration = new Config();

//See CPU number for clustering
var numCPUs = require('os').cpus().length;

// -- Detect Prod Env // You can customize this test
if ((/^\/var\/www/).test(root_path) || /^\/home\/www/.test(root_path)) {
   env = 'prod';
}
// -- Set number of CPUs instances
numCPUs = (env == 'dev') ? 1 : Math.max(2, numCPUs);

utils.applog('info', 'ENV = ' + env);
utils.applog('info', 'CPUs #' + numCPUs);

// If app.js goes down, app works thanks to workers
// if all workers go down and app.js is up, the app doesn't work
//if (cluster.isMaster) {
//
////   // Fork workers.
////   for (var i = 0; i < numCPUs; i++) {
////      cluster.fork();
////   }
////
////   cluster.on('exit', function (worker) {
////      utils.applog('warn', 'Worker ' + worker.pid + ' died. Restart...');
////      // refork the process if one death
////      cluster.fork();
////   });
//
//   // Helper to fork a new instance
//   function WorkerFork() {
//      var worker = cluster.fork();
//      worker.on('message', function(msg) {
//         utils.applog('info', '[>] ' + id + ' | New message :: ' + msg);
//      });
//   }
//
//   // Fork workers.
//   for (var i = 0; i < numCPUs; i++) {
//      setTimeout(function() {
//         WorkerFork() ;
//      }, i*30000);
//   }
//
//   // On exit, restart worker
//   cluster.on('exit', function(worker, code, signal) {
//      var exitCode = worker.process.exitCode;
//      utils.applog('warn', '[*] ' + worker.id + ' | worker died : ' + worker.process.pid + ' (' + exitCode + ').');
//      if ( !cluster.isExiting ) {
//         utils.applog('warn', '[>] ' + worker.id + ' | worker restarting...');
//         setTimeout(function() {
//            WorkerFork();
//         }, 500)
//      }
//   });
//
//   // Message when worker is lonline
//   cluster.on('online', function(worker) {
//      utils.applog('info', '[>] ' + worker.id + ' | worker responded after it was forked');
//      worker.send('Hello you !');
//   });
//
//   ///////////////////////////////////////////////////////////// PROTECT EXIT /////////////
//   // Start reading from stdin so we don't exit.
//   process.stdin.resume();
//   process.on('SIGINT', function () {
//      cluster.isExiting = true ;
//      async.series({
//         foo: function(callback) {
//            callback(null, true)
//         }
//      }, function() {
//         utils.applog('info', '[*] Exit as a gentleman !') ;
//         process.exit(0);
//      })
//   });
//
//
//} else {

   // Instance the application
   configuration.Application(app);

   // get all controller as a module (all function is route)
   fs.readdir(__dirname + '/controller', function (err, files) {
      files.forEach(function (item) {
         if (item != '.DS_Store' && item != '.svn' && item != '.git') {
            require('./controller/' + item).route(app);
            utils.applog('info', 'Registered controller ' + item) ;
            //console.log('Registered controller ' + item) ;
         }
      });
   });


   // Define server variable
   var server;

   // If https params is set start with https
   if (parameters.https_options) {
      // require https library
      var https = require('https');

      // Get the credentials and create HTTPS server
      var pk = fs.readFileSync(parameters.https_options.private_key).toString();
      var pc = fs.readFileSync(parameters.https_options.certificate).toString();
      var server = https.createServer({key: pk, cert: pc}, app);

      // Start listening
      server.listen(parameters.client_port, parameters.client_host);
      utils.applog('info', 'started web server, listening ' + parameters.client_host + ':' + parameters.client_port);
      console.log('started web server, listening ' + parameters.client_host + ':' + parameters.client_port);

   } else {

      var server = require('http').createServer(app);
      // Else start listening in http
      server.listen(parameters.client_port, parameters.client_host);
//      server.listen(parameters.client_port /*, parameters.client_host*/);
      utils.applog('info', 'started web server, listening ' + parameters.client_host + ':' + parameters.client_port);
      console.log('started web server, listening ' + parameters.client_host + ':' + parameters.client_port)
   }

   // If realtime application is defined, start socket.io
   if (parameters.realtime) {
      // Require socket.io liberary
      var sio = require('socket.io');
      // Start Socket.io
      var io = sio.listen(server);

      // Call the Socket.io configuration definition
      configuration.SocketIO(io);

      // Call the Socket.io definition
      require('./realtime').realtime(io);
   }

//}
