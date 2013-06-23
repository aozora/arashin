/*
 * MuContent
 * 
 * The Login controller
 * 
 */
 
// Requirements
var utils = require('../lib/utils');
var parameters = require('../params');
var Model = require('../models/base');
var fs = require('fs');

/*
 *  The route function
 * 	Get as parameter the application instanced in app.js
 * 
 */
 
function route (app) { 
  	
    // Set index route
    app.get('/', utils.accesslog, function(req, res){
        res.render('index'); 
    });    
        
    // Language choose route    
    app.get('/locales/:choosed_lang', function (req, res) {
        req.session.language = req.params.choosed_lang;
        res.redirect('back');
     });

    // The static page routing
    app.get('/:static', utils.accesslog, function (req, res, next) { 
        // Check if the request page exists on view
        if (fs.existsSync(req.params.static)) {
            res.render(req.params.static);
        } else { 
            next();
        }
    });
}

exports.route = route;
