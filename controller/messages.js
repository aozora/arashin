/*
 * TheApp
 * 
 * The Message controller
 * manage notifications and messages from users
 * 
 */
 
// REQUIREMENTS
var utils = require('../lib/utils');
var parameters = require('../params');
var Model = require('../models/base');
// Use async to multiple db connections
var async = require('async');
// Use mongodb to define the id object in this controller
var BSON = require('mongodb').BSONPure; 
var redis = require("redis");

 // Create Redis Client
var client = redis.createClient();

// Get error on Redis connection
client.on("error", function (err) {
	utils.applog('error', "Error on Redis " + err);
});
/*
 *  The route function
 * 	Get as parameter the application instanced in app.js
 * 
 */

function route (app) {

    // Get the messages for the user
    app.get('/messages', utils.accesslog, utils.restricted, function (req, res) { 
        var find = {
            email: req.session.user  
        };
        var options = {};
        var objects = new Model(res.locals.mapping, 'users')
        objects.find(find, options, function (results) {
            if (results) {
                // send on view only messages array
                res.render('message_information', {data: results[0].messages, follower: results[0].follower, followed: results[0].followed}); 
            }else {
                res.render('message_information');
            }
        });
    });
    
    // Add a message
    app.post('/messages/add', utils.accesslog, utils.restricted, function (req, res) { 
        async.parallel({
            // Store data into mongodb
            mongodb: function(callback) {
                // Create an id for comment
                var message_id = new BSON.ObjectID();
                // Find the user that must receive the message
                var find = {
                    email: req.body.receiver
                };
                // Setup the message value to push into the array
                var value = {
                    $push: {messages: 
                        {id: message_id, text: req.body.text, author: req.session.username}
                    }
                };
                var objects = new Model(res.locals.mapping, 'users')
                objects.update(find, value, function (results) {
                    if (results) {
                        callback(null, results.name);
                    } else {
                        callback(null);
                    }
                });
            },
            // Send notifications
            redis: function(callback){
                client.incr('notify:number:' + req.body.receiver);
                client.append('notify:messages:' + req.body.receiver, "New message from " + req.session.user + "<br>");
                callback(null, 'done');
        
            },
        },
        function(err, results) {
            // results is now equal to: {mongodb: 1, redis: 2}
	    if (results.mongodb && results.redis) {
                req.session.flashMessage = [{msg: 'errors.done'}];
                res.redirect('back');
            } else {
                req.session.flashMessage = [{msg: 'errors.notFound'}];
                res.redirect('back');
            }
        });
    });
    
    // Get the message number as ajax request
    app.get('/messages/number', utils.accesslog, utils.restricted, function (req, res) { 
        client.get("notify:number:" + req.session.user, function(err, results) { 
            // Check if there are notify, otherwise send 0
            if(results) {
                res.send(results);
            } else {
                res.send("0");
            }
        });
    });
    // Get the notify text
    app.get('/messages/text', utils.accesslog, utils.restricted, function (req, res) { 
        client.get("notify:messages:" + req.session.user, function(err, results) {
            // Check if there are notify, otherwise send 0
            if(results) {
                res.send(results);
            } else {
                res.send('');
            }
        });
    });
    // Clear the read notify
    app.get('/messages/clear', utils.accesslog, utils.restricted, function (req, res) { 
        client.expire("notify:number:" + req.session.user, 0);
        client.expire("notify:messages:" + req.session.user, 0);
        res.send(200);
    });
};

exports.route = route;
