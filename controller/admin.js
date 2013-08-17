/*
 * Arashin
 * 
 * The Admin controller
 * 
 */

// Requirements
var utils = require('../lib/utils');
var parameters = require('../params');

/*
 *  The route function
 * 	Get as parameter the application instanced in app.js
 *
 */
function route(app) {


   // Set index route
   app.get('/admin', utils.accesslog, function (req, res) {
      res.render('index');
   });



   // Set login route
   app.get('/admin/login', utils.accesslog, function (req, res) {
      res.render('login');
   });


}

exports.route = route;
