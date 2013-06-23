/*
 * MuContent
 * Test functions
 *
 */

// Requirements
var assert = require('assert');
var request = require('request');
var mongodb = require('mongodb');

// Set to true to have console log for the requests
var verbose = false;

// Test Data
var test_data = {
	email: 'pippo@pippo.com',
	password: 'topolino',
	salt: 'pippo',
        role: 'admin'
}
var db_name = "prova";

// Create the id for the admin user
var ObjectID = require('mongodb').ObjectID;
var idString = '4e4e1638c85e808431000003';

describe("Authentication", function () {

	// Before user test install an user into Redis
	before(function (done) {

		// Connect to MongoDB
		var server1 = new mongodb.Server("127.0.0.1", 27017, {});
		new mongodb.Db(db_name, server1, {}).open(function (error, client) {
			if (error) throw error;
			var collection = new mongodb.Collection(client, 'users');
			// Create test user
                        collection.insert({_id: new ObjectID(idString), email: test_data.email, password: 'e8f7d7e1c7e709cbaac93c7f4b07d2a2c5e53192', salt: test_data.salt, role: test_data.role}, function(err, docs) {		
				// Alert if error
				assert.equal(error, null);
			
				// Test if value is truthy.
				assert(docs);
				// Log the results
				if (verbose) {
					console.log(docs);
				}

			});
			server1.close();
		});		
		done();
	});
	
	// Test basic route
	describe("GET /", function () {
		it('responds with default route', function (done) {
			var options = {
				uri: 'http://localhost:8000/'
			};
			request(options, function(error, response, body) {
				// Alert if error
				assert.equal(error, null);
				
				// Test if value is truthy.
				assert(body);
				// Log the results
				if (verbose) {
					console.log(body);
				}

				// Finish asynchronous test
				done();
			});
		});
	});

	// Test login 
	// Correct Login
	describe('POST /login', function() {
		it('responds with success (correct credentials)', function(done) {
			var options = {
				uri: 'http://localhost:8000/login',
				form: {
					// Change this with a valid user credentials
					email: test_data.email,
					password: test_data.password
				}
			};
			request.post(options, function(error, response, body) {
				// Alert if error
				assert.equal(error, null);
				
				// Test if value is truthy.
				assert(body);
				// Log the results
				if (verbose) {
					console.log(body);
				}

				// Finish asynchronous test
				done();
			});
		});
	});
	// Incorrect login
	describe('POST /login', function() {
		it('responds with error (incorrect credentials)', function(done) {
			var options = {
				uri: 'http://localhost:8000/login',
				form: {
					email: 'unknow',
					password: 'unknow'
				}
			};
			request.post(options, function(error, response, body) {
				// Alert if error
				assert.equal(error, null);
				
				// Test if value is truthy.
				assert(body);
				// Log the results
				if (verbose) {
					console.log(body);
				}

				// Finish asynchronous test
				done();
			});		
		});
	});
	
	// Incorrect login (not valid credentials for validator)
	describe('POST /login', function() {
		it('responds with error (incorrect credentials, no validation)', function(done) {
			var options = {
				uri: 'http://localhost:8000/login',
				form: {
					email: '',
					password: ''
				}
			};
			request.post(options, function(error, response, body) {
				// Alert if error
				assert.equal(error, null);
				
				// Test if value is truthy.
				assert(body);
				// Log the results
				if (verbose) {
					console.log(body);
				}

				// Finish asynchronous test
				done();
			});		
		});
	});


	// Call the app method create
	describe("POST /user/create", function () {
		it('Create a new user for test the route', function (done) {
			var options = {
				uri: 'http://localhost:8000/user/create',
				form: {
					// Change this with a valid user credentials
					email: 'paperino@dsa.it',
					password: 'topolino',
					salt: 'pippo',
					role: 'user'
				}
			};
			request.post(options, function(error, response, body) {
				// Alert if error
				assert.equal(error, null);
			
				// Test if value is truthy.
				assert(body);
				// Log the results
				if (verbose) {
					console.log(body);
				}

				// Finish asynchronous test
				done(); 
			});
		});
	});
	
	// Call the app method update
	describe("POST /user/edit", function () {
		it('Update the user', function (done) {
			var options = {
				uri: 'http://localhost:8000/user/edit',
				form: {
                                    email: 'paperino@dsa.it',
                                    password: 'hello',
                                    role: 'admin'
				}
			};
			request.post(options, function(error, response, body) {
				// Alert if error
				assert.equal(error, null);
			
				// Test if value is truthy.
				assert(body);
				// Log the results
				if (verbose) {
					console.log(body);
				}

				// Finish asynchronous test
				done();
			});
		});
	});
		
	// Try to edit different user
	describe("POST /user/edit (different user)", function () {
		it('Update the user', function (done) {
			var options = {
				uri: 'http://localhost:8000/user/edit',
				form: {
                                    email: test_data.email,
                                    role: 'user',
					// Change this with a valid user credentials
					name: 'Paperino',
					surname: 'Duck'
				}
			};
			request.post(options, function(error, response, body) {
				// Alert if error
				assert.equal(error, null);
			
				// Test if value is truthy.
				assert(body);
				// Log the results
				if (verbose) {
					console.log(body);
				}

				// Finish asynchronous test
				done();
			});
		});
	});
        
	// Get user information
	describe("GET /user/view", function () {
		it('Get user information for the test usernames, with pippo that is an admin', function (done) {
			var options = {
                        // TODO: See how get user id
				uri: 'http://localhost:8000/user/view'
			};
			request(options, function(error, response, body) {
				// Alert if error
				assert.equal(error, null);
				
				// Test if value is truthy.
				assert(body);
				// Log the results
				if (verbose) {
					console.log(body);
				}

				// Finish asynchronous test
				done();
			});
		});
	});
		
	// After user test call the app method delete
	describe("DELETE /user/delete/UserId", function () {
		it('Delete the new user for test the route', function (done) {
			var options = {
                            // Remove the test admin use the idString variable set on the start
				uri: 'http://localhost:8000/user/delete/' + idString
			};
			request.get(options, function(error, response, body) {
				// Alert if error
				assert.equal(error, null);
				
				// Test if value is truthy.
				assert(body);
				// Log the results
				if (verbose) {
					console.log(body);
				}

				// Finish asynchronous test
				done();
			});
		});
	});
	
	// After: remove all user from Mongodb
	after(function (done) {
            // Connect to MongoDB
		var server2 = new mongodb.Server("127.0.0.1", 27017, {});
		new mongodb.Db(db_name, server2, {}).open(function (error, client) {
			if (error) throw error;
			var collection = new mongodb.Collection(client, 'users');
			// Create test user
                        collection.remove({}, function(err, docs) {		
				// Alert if error
				assert.equal(error, null);
			});
			server2.close();
		});	
	});
		
});
