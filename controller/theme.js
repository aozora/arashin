/*
 * TheApp
 * 
 * The Theme controller
 * manage view in views directory
 * 
 */
 
// REQUIREMENTS
var utils = require('../lib/utils');
var fs = require('fs');
var hbs = require('../lib/hbs');

hbs.registerHelper('view_list', function(site) {
    var html="";
    var files = fs.readdirSync(__dirname + '/../sites/' + site + '/views/');
    for(var i=0; i<files.length; i++){
	var file = files[i];
	html += '<a href="/theme/' + file.split('.')[0] + '">' + file + '</a><br>';
    }
    return html;
});


/*
 *  The route function
 * 	Get as parameter the application instanced in app.js
 * 
 */

function route (app) {

    // Add a new static page    
    app.get('/theme/new', utils.accesslog, utils.restricted, function (req, res) {
        res.render('theme');
    });
    
    // Get the list of view and set as header the basic view in textarea
    app.get('/theme/:view?', utils.accesslog, utils.restricted, function (req, res) { 
        var view;
        if (req.params.view) {
            view = req.params.view;
        } else {
            view = "header"
        }
        fs.readFile(__dirname + '/../sites/' + res.locals.mapping + '/views/' + view + '.hbs', 'utf8', function (err, data) {
            if (err) {
                utils.applog('error', 'Error with theme: ' + err);
                req.session.flashMessage = [{msg: 'errors.notFound'}];    
                res.redirect('back');
            } else {
		res.render('theme', {data: data, view: view});
            }
        });
	
    });
    
    // Get the list of view and set as header the basic view in textarea
    app.post('/theme', utils.accesslog, utils.restricted, function (req, res) {
	fs.writeFile(__dirname + '/../sites/' + res.locals.mapping + '/views/' + req.body.view + '.hbs', req.body.value, function (err) {
            if (err) {
                utils.applog('error', 'Error with theme: ' + err);   
                req.session.flashMessage = [{msg: 'errors.notFound'}];    
                res.redirect('back');
            } else {         
                req.session.flashMessage = [{msg: 'errors.done'}];
                res.redirect('back');
            }
        });
    });
        
};

exports.route = route;

