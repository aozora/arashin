/* 
 * MuContent
 * 
 * MongoDB Dynamic model
 * 
 */

var mongodb = require('mongodb');
var utils = require('../lib/utils');
var parameters = require('../params');

/*
 * The class
 * Get database and collection names to instance the connection with mongodb
 */

var ModelsBase = function(database, collection) {
	this.database = database;
	this.serverMongo = new mongodb.Server(parameters.mongodb_ip, parameters.mongodb_port, {auto_reconnect: true});
        // With safe this return the information of the success/error of the insert/update/remove
  	this.db = new mongodb.Db(this.database, this.serverMongo, {w: 1}); 
	this.collection = collection;
}

/*
 * Find the value
 * options: query options like skip or limit
 * Return the object based on value
 * 
 */

ModelsBase.prototype.find = function(value, options, callback) {
	var self = this;
	this.db.open( function (error, client) { 
		if (error) throw error;
		client.collection(self.collection).find(value, options).toArray( function (err, objects) {
			if (err) {
				utils.applog('error', 'From Model find:' + err.message);
			} else {
				callback(objects);
			}
			self.serverMongo.close();
		});
	});
};

/*
 * Insert the value
 * Return the object based on value
 * 
 */
ModelsBase.prototype.insert = function (value, callback) {
	var self = this;
	this.db.open( function (error, client) {
		if (error) throw error;
		client.collection(self.collection).insert(value, function (err, objects) {
			if (err) {
				utils.applog('error', 'From Model insert: ' + err.message);
			} else {
				callback(objects);
			}
			self.serverMongo.close();
		});
	});
};

/*
 * Update the value
 * Return the object based on value
 * 
 */

ModelsBase.prototype.update = function (field, value, callback) {
	var self = this;
	this.db.open( function (error, client) {
		if (error) throw error;
                // with findandmodify we get back the modify object
		client.collection(self.collection).findAndModify(field, [['_id', 'asc']], value, {new:true}, function (err, objects) {
				if (err) {
					utils.applog('error', 'From Model update: ' + err.message);
				} else {
					callback(objects);
				}
				self.serverMongo.close();
		});
	});
};

/*
 * Remove the value
 * Return the object based on value
 * 
 */

ModelsBase.prototype.remove = function (value, callback) {
	var self = this;
	this.db.open( function (error, client) {
		if (error) throw error;
		client.collection(self.collection).remove(value, function (err, objects) {
			if (err) {
				utils.applog('error', 'From Model remove: ' + err.message);
				callback({msg: "errors.notRremoved"});
			} else {
				callback({msg: "errors.removed"});
			}
			self.serverMongo.close();
		});
	});
};

module.exports = ModelsBase;
