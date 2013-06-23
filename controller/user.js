/*
 * MuContent
 * 
 * The User controller
 * 
 */
 
// Requirements
var utils = require('../lib/utils');
var UserModels = require('../models/base');
var crypto = require('crypto');
// Use mongodb to define the id object in this controller
var BSON = require('mongodb').BSONPure;
var hbs = require('../lib/hbs');

// HBS Helper for check type in user_form view and send right content
hbs.registerHelper('seeType', function(part) {
    // Check if the value type passed to view is create or edit
    if(this.type === "create") {
        // Get the code in the main block
        return part.fn(this);
    } else {
        // Get the code in the else block
        return part.inverse(this);
    }
});

/*
 *  The route function
 * 	Get as parameter the application instanced in app.js
 * 
 */

function route (app) {

	// Login get route
	app.get('/login', utils.accesslog, utils.already_auth, function(req, res){
		res.render('login');
	});
	
	// Login post route
	app.post('/login', utils.accesslog, function (req, res) {
		// Sanitize and check the form
		req.assert('email', 'errors.wrongEmail').isEmail();
		req.assert('password', 'errors.wrongPasswordLength').len(4,20);
		req.assert('password', 'errors.wrongPasswordChar').isAlphanumeric();
		// No space or special character at the end or start of the line
		req.sanitize('email').trim(' ');
		req.sanitize('password').trim(' ');
		// Get errors as object (without true it give errors as array of object)
		// NOTE: ERRORS is an array of objects
		var errors = req.validationErrors();
                
		// If there are errors on validation send alert, or check for the user
		if (errors) { 
			// For now don't parse error object, only stringify
			// Write in log the attempt
			utils.applog('warn', "Error for " + req.body.email + "in login attempt: " + JSON.stringify(errors));
			res.render('login', {email: req.body.email, message: errors});
		} else {

			// Create instance
			var user = new UserModels(res.locals.mapping, 'users');
			// Get the user with usernam
			user.find({email: req.body.email}, {}, function callback (results) {
				
				if (results[0]) {
					// Calculate the password hash
					var newhash = crypto.createHash('sha1').update(req.body.password+results[0].salt).digest('hex');

					if (results[0].password === newhash) {
						// If check is done, set session 
						req.session.user_id = results[0]._id;
						req.session.user = results[0].email;
						req.session.username = results[0].name;
						req.session.connected = true;
                                                req.session.userslug = results[0].slug;
						// Set user role
                                                req.session.role = results[0].role;
                                                res.redirect('/');
                                        } else {
                                            // TODO See if add the wrong password attempt too
                                            utils.applog('warn', "Error for " + req.body.email + "in login attempt: wrong password");
                                            // Wrote a message that the callback return. Limit user information about the error, for security reasons
                                            res.render('login', {type: req.params.operation, message: [{error: 'NOTFOUND', msg: 'errors.notFound'}]});
					}
				} else {
					// Wrote a message that the callback return. Limit user information about the error, for security reasons
					res.render('login', {type: req.params.operation, message: [{error: 'NOTFOUND', msg: 'errors.notFound'}]});
				}
			
			});
		}
	});
	
	// The logout route
	app.get('/logout', utils.accesslog, utils.restricted, function(req, res){
		req.session.destroy(function(err){
			if (err) {
				utils.applog('error', err);
			}
        });

		res.redirect('/');
	});

    // The route for user get
    app.get('/user/create/:id?', utils.accesslog, function (req, res) {
			// Only admin can create new user
			if (req.session.user && !req.session.admin) {
				res.redirect('/');
			} else {
				// Admin can access to specific field using req.session.admin
				res.render('user_form', {type: 'create'});
			}
    });         
    app.get('/user/edit/:id?', utils.accesslog, function (req, res) {
			// Check if user is the account's owner or the admin
			if ((req.session.user_id === req.params.id) || (req.session.role == 0)) {
                        	// Define object id in mongodb
				var o_id = new BSON.ObjectID(req.params.id);
                                var value = {_id: o_id}, options = {};
                
				// Create instance
				var user = new UserModels(res.locals.mapping, 'users');
				// Get the user with id
				user.find(value, options, function callback (results) {

					if (results[0]) {					
						res.render('user_form', {data: results[0], type: 'edit'});
					} else {
                                                utils.applog('error', 'User ' + req.params.id + ' not found for edit request by ' + req.connection.remoteAddress);
						res.render('50x');
					}
				});
			} else {
                            res.render('50x');
			
			
			}
    });  
    app.get('/user/delete/:id?', utils.accesslog, function (req, res) {
			// Only admin can do this
			if (req.session.role == 0) {
				// Define object id in mongodb
				var o_id = new BSON.ObjectID(req.params.id);

				// Create instance
				var user = new UserModels(res.locals.mapping, 'users');
				// Get the user with id
				user.remove({_id: o_id}, function callback (results) {
					res.redirect('/user/view');
				});
			} else {
                                utils.applog('error', 'User ' + req.params.id + ' request delete without permissions by ' + req.connection.remoteAddress);
				// Give application error if not admin
				res.render('50x');
			}
    });
    app.get('/user/view/:id?', utils.accesslog, function (req, res) {
			// Check session to see if user is connected and is user id and role, only admin can see all users, other can see only their information
			if (req.session.connected) {
				
                            var value = {}, options = {};
                
                            // If the user is not an admin
                            if (req.session.role != 0) { 
                                // Define object id in mongodb
                                var o_id = new BSON.ObjectID(req.session.user_id);
                                value = {_id: o_id};
                            }
                
                            // Create instance
                            var user = new UserModels(res.locals.mapping, 'users');
                            // Get the user with id
                            user.find(value, options, function callback (results) {

				if (results[0]) {					
					res.render('user_information', {admin: req.session.admin, data: results});
				} else {
                                    utils.applog('error', 'Operation view without results by ' + req.connection.remoteAddress);
                                    res.render('50x');
			
				}

                            });
			} else {
                                utils.applog('error', 'operation ' + req.headers.url + ' not found by ' + req.connection.remoteAddress);				// Give application error if not connected
				res.render('50x');
			}
	});
	
	// The post for user create or update, we pass the type as url parameter and then the use body information
	app.post('/user/:operation', utils.accesslog, function (req, res) {
		// Sanitize and check the form
		req.assert('email', 'errors.wrongEmail').isEmail();
		req.assert('password', 'errors.wrongPasswordLength').len(4,20);
		req.assert('password', 'errors.wrongPasswordChar').isAlphanumeric();
                req.assert('name', 'errors.wrongNameLength').len(4,20);
		// No space or special character at the end or start of the line
		req.sanitize('email').trim(' ');
		req.sanitize('password').trim(' ');
		// Get errors as object (without true it give errors as array of object)
		var errors = req.validationErrors();

		// If there are errors on validation send alert, or check for the user
		if (errors) { 
			// For now don't parse error object, only stringify
			// Write in log the attempt
			utils.applog('warn', "Error for " + req.body.email + "in registration attempt: " + JSON.stringify(errors));
			// NOTE: You can set header like 500 if you want return internal server error to client, for now it return
			// an error with status code 200 (OK)
			res.render('user_form', {type: req.params.operation, message: errors, data: req.body});
		} else {
                        // Create a random salt
			var salt = crypto.randomBytes(256);
			// Generate crypt password with salt
			var myhash = crypto.createHash('sha1').update(req.body.password+salt).digest('hex');
			// Create the JSON for the database
			var value = {};
                        var slug = req.body.name;
                        slug = slug.replace(/\s/g,'-').toLowerCase();
                        value.slug = slug;
                        value.name = req.body.name;
                        if (req.params.operation === "create") {
                            value.email = req.body.email;
                        }
			value.password = myhash;
                        value.salt =  salt;
                        // Set the role, default is user for registred user with simple permissions, else if admin set the role
                        // This don't allow to the user to change your role to admin or other
                        if (req.body.role && req.session.admin) {
                            value.role = req.body.role;
                        } else {
                            // Setthe defaut role number for user (1)
                            value.role = 1;
                        }
			// Instance User class
			var user = new UserModels(res.locals.mapping, 'users');
			if (req.params.operation === "create") {
				// Only admin can create new user
				if (req.session.user && !req.session.admin) {
					res.redirect('/');
				} else {
        	                    // Instance a new class only for the find operation
	                            // Instance this because mongodb don't allow multiple connection with the same class 
                	            var user_find = new UserModels(res.locals.mapping, 'users');
                        	     // Check if there is other equal email in the database, mail must be unique
                            		user_find.find({email: req.body.email}, {}, function (results) {
                                	if (results[0]) {
                                            // Give application error if user is already present
                                            utils.applog('error', 'User ' + req.body.email + ' already present by ' + req.connection.remoteAddress);
	                                    res.render('50x');
        	                        } else {
                	                    user.insert(value, function (results) { 
                                                // Do this only if admin (role = 0)
                                                if (req.session.role != 0) {
                                                    // Send email to user
                                                   var compose = {
                                                       email: req.body.email,
                                                       password: req.body.password
                                                   };
                                                   utils.sendmail(req.body.email, "registration", "registration", compose, req.session.language, res.locals.mapping);
                    
                                                    // If check is done, set session and login the user
                                                    req.session.user_id = results[0]._id; 
                                                    req.session.user = results[0].email;
                                                    req.session.username = results[0].name;  
                                                    req.session.connected = true;
                                                    req.session.role = results[0].role;
                                                }
                                                res.redirect('back');
                                	    });
	                                }	
        	                     });
				}

                         } else if (req.params.operation === "edit") {
				// Only admin or owner can edit their profile
				if ((req.session.user === req.body.email) || (req.session.role == 0)) {
                                    user.update({email: req.body.email}, {$set: value}, function (results) {console.log(results);
                                        // Create an array for results, because the update get back an object and on view wait for an array
                                        var results_array = new Array(results);
                                        res.render('user_information', {data: results_array});
                                    });
                                } else {
                                    utils.applog('error', 'Edit attempt not permitted for user ' + req.body.email + " from " + req.connection.remoteAddress);
                                    res.render('50x');
				}
			} else {
                            res.render('40x');
			}
		}
	});
}

exports.route = route;

