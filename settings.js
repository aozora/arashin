/**
 * Module dependencies.
 */

var express = require('express')
   , passport = require('passport')
   , mongoStore = require('connect-mongodb')
   , flash = require('./lib/express-flash')
   , url = require('url')
   , i18n = require('i18n');

exports.boot = function (app) {
   bootApplication(app);
};



// App settings and middleware
function bootApplication(app) {

   // set views path, template engine and default layout
   app.set('views', __dirname + '/app/views');
   app.set('view engine', 'jade');

   // bodyParser should be above methodOverride
   app.use(express.bodyParser());
   app.use(express.methodOverride());
   app.use(express.cookieParser());

   // configure session
   var MemStore = express.session.MemoryStore;
   app.use(
      express.session({
         secret: 'arashin',
         store: new MemStore({
         reapInterval: 60000 * 10
         })
      })
   );
//   app.use(express.session({
//       secret: 'arashin'
//      ,cookie: { maxAge: 60000 }
//   }));
//   app.use(express.session({
//      secret: 'arashin',
//      store: new mongoStore({
//            db: mongoose.connection.db,
//            reapInterval: 3000   // check every 3 seconds
//         },
//      function(err){
//         console.log(err || 'connect-mongodb setup ok');
//      })
//   }));


   // use connect-flash in place of old req.flash
   app.use(flash());

   app.use(express.logger(':method :url :status'));
   //app.use(express.favicon()); // __dirname + '/path/to/favicon.ico'

   // passport authentication
   app.use(passport.initialize());
   app.use(passport.session());

   // serve static files
   app.use(express.static(__dirname + '/public'));


   // Localization
   i18n.configure({
      // setup some locales - other locales default to en silently
      locales:['en', 'it']
   });
   // using 'accept-language' header to guess language settings
   app.use(i18n.init);
   console.log('Localization with i18 ok');


   // View Helpers for Express v3.x
   app.use(function (req, res, next) {
      // expose the current path as a view local
      res.locals.url = url.parse(req.url).href;
      res.locals.path = url.parse(req.url).pathname;
      res.locals.request = req;
      res.locals.current_user = req.user;

      //res.locals.app_settings = config.app;

      // register helpers for wordpress compatibility functions
      res.locals.wp = require('./lib/wp')(req, res);

      // flash messages
      res.locals.messages = require('./lib/helpers/express-messages').messages(req, res);

      // dateformat helper. Thanks to gh-/loopj/commonjs-date-formatting
      res.locals.dateformat = require('./lib/helpers/dateformat').strftime;

      // return the app's mount-point so that urls can adjust.
      res.locals.base = '/' == app.route ? '' : app.route;

      // i18n view helpers
      res.locals.__i = i18n.__;
      res.locals.__n = i18n.__n;

      next();
   });



//   // Don't use express errorHandler as we are using custom error handlers
//   // app.use(express.errorHandler({ dumpExceptions: false, showStack: false }))
//   app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
//
//   // show error on screen. False for all envs except development
//   // settings for custom error handlers
//   app.set('showStackError', false);

   // configure environments

//   app.configure('development', function () {
//      app.set('showStackError', true);
//   });


   // Show all errors and keep search engines out using robots.txt
   app.configure('development', function(){
      app.use(express.errorHandler({
          'dumpExceptions': true
         ,'showStack': true
      }));
      app.all('/robots.txt', function(req,res) {
         res.send('User-agent: *\nDisallow: /', {'Content-Type': 'text/plain'});
      });
   });

   // Suppress errors, allow all search engines
   app.configure('production', function(){
      app.use(express.errorHandler());
      app.all('/robots.txt', function(req,res) {
         res.send('User-agent: *', {'Content-Type': 'text/plain'});
      });
   });




   //   // gzip only in staging and production envs
//
//   app.configure('staging', function () {
//      app.use(gzippo.staticGzip(__dirname + '/public'));
//      app.enable('view cache');
//   });
//
//   app.configure('production', function () {
//      app.use(gzippo.staticGzip(__dirname + '/public'));
//      // view cache is enabled by default in production mode
//   });

}
