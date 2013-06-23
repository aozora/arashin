/*
 * TheApp
 * 
 * The Media controller
 * 
 */
 
// REQUIREMENTS
var utils = require('../lib/utils');
// Use knox S3 library
var knox = require('knox');
var fs = require('fs');
// Use mongodb to define the id object in this controller
var BSON = require('mongodb').BSONPure;
var async = require('async');
var redis = require("redis");
var hbs = require('../lib/hbs');
 
// Create Redis Client
var client = redis.createClient();

// Get error on Redis connection
client.on("error", function (err) {
	utils.applog('error', "Error on Redis " + err);
});

// AMAZON AWS Credentials
var AWS_KEY = '';
var AWS_SECRET = '';
var AWS_BUCKET =  ''; // The bucket name
var AWS_BUCKET_DIRECTORY = '/'; // default directory where send the files

// HBS helper to add an image
hbs.registerHelper('insert_image', function(name) {
    var bucket = 'https://s3.amazonaws.com/' + AWS_BUCKET;
    return bucket;
});

/*
 *  The route function
 * 	Get as parameter the application instanced in app.js
 * 
 */

function route (app) {
    // View media
    app.get('/media', utils.accesslog, function (req, res) {       
        res.render('media');
                       
    });
    // Route for delete media
    app.get('/media/delete/:filename', utils.accesslog, function (req, res) {  
                        // Create knox client
                        var client = knox.createClient({
                            key: AWS_KEY,
                            secret: AWS_SECRET,
                            bucket: AWS_BUCKET
                        });
                        // replace space in filename (amazon S3 don't allow them)
                        var bucket_directory_filename = AWS_BUCKET_DIRECTORY+req.params.filename;

                            client.deleteFile(bucket_directory_filename, function (err, res) {
                                if (err) {
                                   utils.applog('error', 'Not removed from bucket: ' + bucket_directory_filename + 'Error: ' + err);
       req.session.flashMessage = [{msg: 'errors.notFound'}];
                    res.redirect('back');
                                } else {
                                    utils.applog('info', "Removed: " + bucket_directory_filename);

                    req.session.flashMessage = [{msg: 'errors.done'}];
                    res.redirect('back');
                                }
                            });

    });
    // POST method for update and insert, id is passed only for update
    app.post('/media/add', utils.accesslog, function (req, res) { 
        var errors_file = [];
        // Validate file size and type
        if (req.files.upload.name) {
            if (req.files.upload.size > 1000000) {
                errors_file.push({msg: 'errors.exceededSize'});
            }
            var type = req.files.upload.type;
            type = type.split('/')[0];
            if (type !== "image"){
                errors_file.push({msg: 'errors.wrongType'});
            }
        }
	// Get errors as object (without true it give errors as array of object)
	// NOTE: ERRORS is an array of objects
	var errors = req.validationErrors(); 
        
        // Add the file test errors in the main errors        
        errors_file.forEach(function (item) {
            errors.push(item); 
        });
	// If there are errors on validation send alert, or check for the user
	if (errors) { 
            // For now don't parse error object, only stringify
            // Write in log the attempt
            utils.applog('warn', "Error for " + req.body.email + "in object insert: " + JSON.stringify(errors));
            res.render('media', {message: errors, data: req.body, type: req.params.action});
	} else {
                    
            // Variable for upload and insert/update
            var filename;
	    var now = new Date();   
    
                
                    // Set filename only if upload 
                    if (req.files.upload.name) {
                        filename = req.files.upload.name;
                        filename = filename.replace(/\s/g,'-');
                        // The file name contain the user slug, the object slug and the filenamse, so there are not conflict
                        filename = req.session.userslug + slug + '_' + filename;
                    }  
                    
                    // Instance s3 upload only if file upload is request
                    if (req.files.upload.name) {
                        // Create knox client
                        var client = knox.createClient({
                            key: AWS_KEY,
                            secret: AWS_SECRET,
                            bucket: AWS_BUCKET
                        });
        
                        var disk_path = req.files.upload.path; // connect save in /tmp as default
                        
                        // replace space in filename (amazon S3 don't allow them)
                        var bucket_directory_filename = AWS_BUCKET_DIRECTORY+filename;

                        fs.readFile(disk_path, function(err, buf){
                            var mimetype = req.files.upload.type;
                            var send_file = client.put(bucket_directory_filename, { 
                                'Content-Type': mimetype,
                                'Content-Length': buf.length,
                                'x-amz-acl': 'public-read' // Set default acl as public
                            });
                            send_file.on('response', function(res){
                                // if sent
                                if (200 == res.statusCode) {
                                    utils.applog('info', 'Saved media to ' + send_file.url);
                                    // Add notification to redis
                                    client.incr('notify:number:' + req.session.user);
                                    client.append('notify:messages:' + req.session.user, "File " + filename + " inviato<br>");
                                    
                                    // delete file in /tmp
                                    fs.unlink(disk_path, function (err) {
                                        if (err) utils.applog('error', 'Not removed: ' + disk_path + 'Error: ' + err);
                                    });

                    req.session.flashMessage = [{msg: 'errors.done'}];
                    res.redirect('back');
                                } else {

                                    utils.applog('error', 'Error saving: ' + bucket_directory_filename);
       req.session.flashMessage = [{msg: 'errors.notFound'}];
                    res.redirect('back');
                                 }
                          });
                          send_file.end(buf);
                        });
                    }
         }                    
    });
    
}

exports.route = route;
