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

// Instance the configuration class
var configuration = new Config();

// See CPU number for clustering
var numCPUs = require('os').cpus().length;

// If app.js goes down, app works thanks to workers
// if all workers go down and app.js is up, the app doesn't work
if (cluster.isMaster) {

    // Fork workers.
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', function(worker) {
        utils.applog('warn', 'Worker ' + worker.pid + ' died. Restart...');
	// refork the process if one death
	cluster.fork();
    });

} else {
	
    // Instance the application
    configuration.Application(app);

    // get all controller as a module (all function is route)
    fs.readdir(__dirname + '/controller', function (err, files) {
        files.forEach(function(item) {
            require('./controller/' + item).route(app);
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

    } else {
	var server = require('http').createServer(app)
	// Else start listening in http
	server.listen(parameters.client_port, parameters.client_host);

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

}
