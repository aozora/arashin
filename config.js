/*
 * MuContent
 * 
 * The configuration file, this class instance the Express settings 
 * and other application settings
 *
 * 
 */

// REQUIREMENTS
var express = require('express');
var expressValidator = require('express-validator');
var RedisStore = require('connect-redis')(express);
var utils = require('./lib/utils');
var hbs = require('./lib/hbs');
var sessionStore = new RedisStore();
var fs = require('fs');
var drex = require('./lib/drex');
// Require parameters class and instance it
var parameters = require('./params');

// Read the locales json and create locales
var locales = {};
fs.readdir(__dirname + '/sites', function (err, sites) {
    sites.forEach(function (site) {
        fs.readdir(__dirname + '/sites/' + site + '/locales', function (err, files) {
            files.forEach(function (file) {
                // Use drex library to dynamic reload the locales
                drex.require(__dirname + '/sites/' + site + '/locales/' + file, function(data) {
                        var lang = site + '_' + file.split('.')[0];                         
                        locales[lang] = data;
                });
            });
        
        });
    });

});

// Read the menu parameters json and create variable
var menu = {};
fs.readdir(__dirname + '/sites', function (err, sites) {
    sites.forEach(function (site) {
        // Use drex library to dynamic reload the locales
        drex.require(__dirname + '/sites/' + site + '/settings/menu.js', function(data) {                        
            menu[site] = data;
        });
    });

});

// Read the misc parameters json and create variable
var misc_params = {};
fs.readdir(__dirname + '/sites', function (err, sites) {
    sites.forEach(function (site) {
        // Use drex library to dynamic reload the locales
        drex.require(__dirname + '/sites/' + site + '/settings/misc.js', function(data) {                        
            misc_params[site] = data;
        });
    });

});

// Extend hbs with block to use private/public resourse for each view
var blocks = {};
 
hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context(this));
});
hbs.registerHelper('block', function(name) {
    var val = (blocks[name] || []).join('\n');

    // clear the block
    blocks[name] = [];
    return val;
});


// HBS Helper for check role and permission and get back the content if user is allowed
// Pass the allowed as a comma separated string like: 0,1,...
// IMP: If only an user group is allowed, don't forget the comma es: 0, => Only admin can see object
// on vi
hbs.registerHelper('checkRole', function(role, allowed, options) {
    // Check if the value type passed to view is create or edit 
    var temp = allowed.split(',');
    if (temp[role]) { 
        return options.fn(this);
    } else {
        return;
    }    
});

// HBS HELPER for multilang, lang is the req.session.language setted by user
hbs.registerHelper('translate', function(keyword, lang, site) {
    var ref = site + '_' + (lang || 'en'); 
    // pick the right dictionary
    var local = locales[ref];
    // loop through all the key hierarchy (if any)
    var target = local;
    var default_ref = site + '_en';
    var default_dict = locales[default_ref];
    var keys = keyword.split(".");
    keys.forEach(function (key){
        if (target[key]) {
            target = target[key];
        } else {
            target = default_dict[key];
        }
     });
     //output
     return target;
});
// Helper used to find available language for the sites
hbs.registerHelper('availableLanguage', function (site) {
    // Read the language files available
    var locales = fs.readdirSync(__dirname + '/sites/' + site + '/locales');
    var html = '';
    // See all file and create the html
    for (var i = 0; i < locales.length; i++) {
        html += '<li><a href="/locales/' + locales[i].split('.')[0] + '">' + locales[i].split('.')[0] + '</a></li>';
    } 
    return html;
});

// Menu helper
hbs.registerHelper('createMenu', function(lang, role, site) {
    var ref = site + '_' + (lang || 'en'); 
    // pick the right dictionary
    var local = locales[ref];
   
    var html = "";
    
    // Get the menu in params
    menu[site].menu.forEach(function (item) {
        var key = item.title;
        var acl = item.acl;
        // Check if the acl is setted, otherwhise all can access
        if (acl) {
            // Write the menu voice only if user role is allowed
            if (acl[role]) {
                html += '<li><a href="' + item.path + '">';
                if (item.icon) {
                    html += '<i class="' + item.icon + '"></i> ';
                }
                html += local[key] + '</a></li>'; 
            }
        } else {
            html += '<li><a href="' + item.path + '">';
            if (item.icon) {
                html += '<i class="' + item.icon + '"></i> ';
            }           
            html += local[key] + '</a></li>'; 
        }
    });
    return html;
});

// Define configuration class
var Config = function () {};

// EXPORT EXPRESS CONFIGURATION SETTINGS
Config.prototype.Application = function(app) {
    // Remove Express information from the response header
    app.use(function (req, res, next) {
	res.removeHeader("X-Powered-By");
        next();
    }); 


    
    // Middleware to get the host for multisite
    app.use(function (req, res, next) {
        // Get the request host and map it to right database into redis 
        var domain = req.headers.host.split(':')[0];
        // Set the parameters mapping
        res.locals.mapping = parameters.vhost[domain];
    
        // Check if site exists, otherwise send error
        if(res.locals.mapping) {
            // Set the view directory
            res.locals.view_dir = __dirname + '/sites/' + res.locals.mapping + '/views';
            // Set favicon if is enabled in configuration parameters
            if (misc_params[res.locals.mapping].favicon) {
                app.use(express.favicon(__dirname + '/sites/' + res.locals.mapping + misc_params[res.locals.mapping].favicon));
            }
            next();
        
        } else {
            utils.applog('error', "Requested and invalid site from: " + req.connection.remoteAddress);
            res.send(parameters.server_error);
        }
    }); 
    
    // maintenance mode middleware
    app.use(function (req, res, next) {
        // Check if is set the maintenance mode in params.js
        if (misc_params[res.locals.mapping].maintenance) {
            // Check if the remote ip is an allowed ip
            if (misc_params[res.locals.mapping].maintenance_allowed[req.connection.remoteAddress]) {
                next();
            } else {
                res.send(misc_params[res.locals.mapping].maintenance_message);
            }
        } else {
            next();
        }
    }); 
		
    // Set view, define the personal engine first
    app.engine('hbs', hbs.__express);
    app.set('view engine', 'hbs');  
    app.use(function (req, res, next) {
        app.set('views', res.locals.view_dir);  
        next();
    });
    
    // Set cookie
    app.use(express.cookieParser(parameters.cookie_secret));
    
    app.use(express.session({
	cookie: {maxAge: 24 * 60 * 60 * 1000}, 
	// SET THE DB PARAMS TO SHARE SESSION ON SAME DATABASE
	store: new RedisStore({
            host: parameters.redis_host,
            port: parameters.redis_port
	}) 
	})
    );

   
    app.use(express.compress());
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    
    app.use(expressValidator);

   // Set static private file directory, use dedicated mounted path /static/private
   app.use('/static/private', function(req, res, next){
	// check athentication
	if(req.session.user){
            express.static(__dirname + '/private')(req, res, next);
	} else {
            utils.applog('error', "Request invalid file from not authorized address: " + req.connection.remoteAddress);
            next(); 
	}
    });
    // Set static public file directory, use dedicated mounted path /static/public
    app.use('/static/public', express.static(__dirname + '/public'));

    // Set the default locals 
    app.use(function(req, res, next){
        // Set guest role
        if (!req.session.role) {
            req.session.role = 1000;
        }
        res.locals.title = misc_params[res.locals.mapping].title;
        res.locals.site_url = misc_params[res.locals.mapping].site_url;
        res.locals.session = req.session;
        // This is used for flash messages on redirect, set the session variable, and if is set pass to locals
        if (req.session.flashMessage) {
            res.locals.message = req.session.flashMessage;
            req.session.flashMessage = false;
        } else {
            res.locals.message = false;        
        }
        next();
    });
        
    app.use(app.router);
    
    // Set error view if env is development
    if ('development' == process.env.NODE_ENV) {
	app.use(express.errorHandler());
    }
    // Set the error page if resource isn't found
    app.use(function(req, res){
	utils.applog('error', "Application page not found " + req.url);
	res.render('40x');
    });
    // Set page for application errors
    app.use(function(err, req, res, next){
	// if an error occurs Connect will pass it down
	// through these "error-handling" middleware
	// allowing you to respond however you like
	utils.applog('error', "Application error: " + err);
	res.render('50x');
    });


};

// DEFINE SOCKET.IO CONFIGURATION
Config.prototype.SocketIO = function (io) {
    io.configure(function() {
	// Limit log level
	io.set('log level', 1);
        // Set store in redis so allow scale
        var RedisStore = require(parameters.realtime_redis_lib),
            redis = require('redis'),
            pub    = redis.createClient(),
            sub    = redis.createClient(),
            client = redis.createClient();
        
        io.set('store', new RedisStore({
          redisPub : pub
        , redisSub : sub
        , redisClient : client
        }));
	// Set authentication method
	io.set('authorization', function(data, callback) {
            if (data.headers.cookie) {
		data.cookie = utils.parseCookie(data.headers.cookie);
		//Get only a part of the hash (remove "s:" and the part after ".")
		// See: http://stackoverflow.com/questions/12217725/socket-io-cookie-parse-handshake-error
		data.sessionID = data.cookie['connect.sid'].split('.')[0].split(':')[1];
		sessionStore.get(data.sessionID, function(err, session) {
                    if (err || !session) {
                        utils.applog('error', "Realtime error: " +  err);
			callback('Error', false);
                    } else {
			data.session = session;
			callback(null, true);
                    }
		 });
            } else {
                utils.applog('error', "Realtime error: no cookie");
		callback('No cookie', false);
            }
	});
    });
};

module.exports = Config;
