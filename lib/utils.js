/*
 * MuContent
 * 
 * The Utils function
 * 
 */

// REQUIREMENTS
var winston = require('winston');
var nodemailer = require("nodemailer");
var handlebars = require('handlebars');
var fs = require('fs');
var drex = require('drex');

// Configure the logger category and remove console logging for these log
// You can use console logging for one of this or both, simply delete .remove(winston.transports.Console)
winston.loggers.add('accesslog', {
	file: {
		filename: './logs/access.log'
    }
}).remove(winston.transports.Console);

winston.loggers.add('applog', {
	file: {
		filename: './logs/app.log'
    }
}).remove(winston.transports.Console);

// QUICK LOG FOR APPLICATION: BASIC PATH: ./logs
function applog(level, s) {
    // Format the string
    s = s.toString().replace(/\r\n|\r/g, '\n');

    // Get winston log configuration and write 
    var applog = winston.loggers.get('applog');
    applog.log(level, s);

}

// QUICK LOG FOR REQUEST: BASIC PATH: ./logs
function accesslog(req, res, next) {
	// Create the string
    var s = "From: " + req.connection.remoteAddress + " " + req.method + " " + req.url + " on: " + req.headers.host;
	
    // If exists, get user information
    if (req.session.user) {
	s = s + " User: " + req.session.user;
    }

    // Get winston log configuration and write 
    var accesslog = winston.loggers.get('accesslog');
    accesslog.info(s);

    // Function done, call next function in route
    next();
}

// Check user authentication
function restricted (req, res, next) {
    if (req.session.user) { 
        var routing;
        // Use drex library to dynamic reload the locals
        drex.require(__dirname + '/../sites/' + res.locals.mapping + '/settings/route.js', function(data) {                        
            routing = data;
        });
        var route = req.url.split('/');
        // Get the route
        var count = 0, size = routing.routing_acl.length;
        // Iterate the acl array
        routing.routing_acl.forEach(function (item) {
            // check if acl is setted for the route, get the route from express
            if (item.route === req.route.path) {
                // Check if user is allowed
                if (item.acl[req.session.role]) { 
                    return next();
                } else {
                    applog('error', "Requested a restricted route " + req.url + " by not allowed from " + req.connection.remoteAddress);
                    // Check if the request routing is an ajax request, to return a different result
                    if (item.ajax) {
                        return res.send("Not allowed");
                    } else {
                        return res.redirect('/');  
                    }
                }
            
            }
            count += 1;
            // If acl is not setted, default allow users
            if (size === count) {
                return next(); 
            }
        }); 
    } else {
        applog('error', "Requested a restricted route " + req.url + " by not allowed from " + req.connection.remoteAddress);
        return res.redirect('/');
    }
}

// Check if user is already auth and redirect to index
function already_auth (req, res, next) {
    if (req.session.user) {
	res.redirect('/');
    } else {
	next();
    }
}

// Parse the cookie to get socket.io authentication handler
function parseCookie (str) {
	var obj = {}
	var pairs = str.split(/[;,] */);
	var encode = encodeURIComponent;
	var decode = decodeURIComponent;

	pairs.forEach(function(pair) {
		var eq_idx = pair.indexOf('=')
		var key = pair.substr(0, eq_idx).trim();
		var val = pair.substr(++eq_idx, pair.length).trim();

		// quoted values
		if ('"' == val[0]) {
			val = val.slice(1, -1);
		}

		// only assign once
		if (undefined == obj[key]) {
			obj[key] = decode(val);
		}
	});

	return obj;

};

// Function to send mail
// Subject is a reference to the handle in the language pack
// Template is the reference to template file
// locales are the variable to pass to template for handlebars
// Language is session.language set by the user
// Site: the site name from res.locals.mapping
function sendmail (to, subject, template, locales, language, site) {
    // Use drex library to dynamic reload the locals
    var misc_params = {}
    drex.require(__dirname + '/../sites/' + site + '/settings/misc.js', function(data) { 
        misc_params = data;
    });

    if (misc_params.allow_mail) { // Check if the email is allowed
        // Set default language if undefined
        if (!language) {
            var language = "en"
        }
        // create reusable transport method (opens pool of SMTP connections)
        // Use amazon SES as transport
        var transport = nodemailer.createTransport("SES", {
            AWSAccessKeyID: misc_params.AWS_KEY,
            AWSSecretKey: misc_params.AWS_SECRET
        });
        // multiple language allow: get the template file by language, pas with locales to handlebar
        // and create the mail text, for subject, get the language pack and find the subject
        // setup e-mail data with unicode symbols
        var source = fs.readFileSync(__dirname + "/../sites/" + site + "/template/" + language + "/" + template + ".html", 'utf8'); 
        var compiled = handlebars.compile(source);
        var mail = compiled(locales);
        // For subject, get locales and create json, then find by handle
        var locales = fs.readFileSync(__dirname + "/../sites/" + site + "/locales/" + language + ".json", 'utf8'); 
        locales = JSON.parse(locales);
        var subject = locales[subject];
        
        var mailOptions = {
            from: misc_params.from, // sender address
            to: to, // list of receivers
            subject: subject, // Subject line
           // text: "Hello world ✔", // plaintext body
            html: mail // html body
        }
        
        // send mail with defined transport object
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                applog('error', 'SendMail error: ' + error);
            }else{
                applog('info', "Message sent: " + response.message);
            }
        
            // if you don't want to use this transport object anymore, uncomment following line
            smtpTransport.close(); // shut down the connection pool, no more messages
        });
    }
}

exports.applog = applog;
exports.accesslog = accesslog;
exports.restricted = restricted; 
exports.already_auth = already_auth;
exports.parseCookie = parseCookie;
exports.sendmail = sendmail;
