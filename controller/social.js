/*
 * TheApp
 * 
 * The social controller
 * Follow tags, object or user
 * 
 */
 
// REQUIREMENTS
var utils = require('../lib/utils');
var Model = require('../models/base');
// Use mongodb to define the id object in this controller
var BSON = require('mongodb').BSONPure;
var async = require('async');
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
    
    // The follow route
    app.get('/follow/add/:type/:value', utils.accesslog, function (req, res) {
        if (req.params.tag) {
            async.parallel({
                in_redis: function (callback) {
                    // Add the user to tag followers into redis set
                    client.sadd(req.params.type + ':follow:' + req.params.v, req.session.user);
                    callback(null, 'done');
                },
                in_mongodb: function (callback) {
                    var find = {
                        email: req.session.user
                    }, value = {
                        $push: {followed_tag: req.params.tag}
                    };
                    // Add the tag in mongodb
                    var user = new Model(res.locals.mapping, 'users');
                    user.update(find, value, function(results) {
                        callback(null, results);
                    });
                
                }
            }, 
            function (err, results) {            
                if (results) {
                    req.session.flashMessage = [{msg: 'errors.done'}];
                    res.redirect('back');
                } else {
                    req.session.flashMessage = [{msg: 'errors.notFound'}];
                    res.redirect('back');
                }
            });
                
        } else {
            req.session.flashMessage = [{msg: 'errors.notFound'}];
            res.redirect('back');
        }
    });
    app.get('/follow/remove/:type/:value', utils.accesslog, function (req, res) {
        if (req.params.tag) {
            async.parallel({
                in_redis: function (callback) {
                    // Add the user to tag followers into redis set
                    client.srem(req.params.type + ':follow:' + req.params.value, req.session.user);
                    callback(null, 'done');
                },
                in_mongodb: function (callback) {
                    var find = {
                        email: req.session.user
                    }, value = {
                        $pull: {followed_tag: req.params.tag}
                    };
                    // Add the tag in mongodb
                    var user = new Model(res.locals.mapping, 'users');
                    user.update(find, value, function(results) {
                        callback(null, results);
                    });
                }
            }, 
            function (err, results) {            
                if (results) {
                    req.session.flashMessage = [{msg: 'errors.done'}];
                    res.redirect('back');
                } else {
                    req.session.flashMessage = [{msg: 'errors.notFound'}];
                    res.redirect('back');
                }
            });
        } else {
            req.session.flashMessage = [{msg: 'errors.notFound'}];
            res.redirect('back');
        }
    });
}

exports.route = route;      
        
