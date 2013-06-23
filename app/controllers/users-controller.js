var User = mongoose.model('User');
var passport = require('passport');

module.exports = function (app, auth) {

   app.param('profileId', function (req, res, next, id) {
      User.findOne({ _id:id }).run(function (err, user) {
            if (err)
               return next(err);

            if (!user)
               return next(new Error('Failed to load User ' + id));

            req.foundUser = user;
            next();
         });
   });


   // Profile view
   app.get('/profile/:profileId', function (req, res) {
      var user1 = req.foundUser;
      res.render('users/profile', {
         title:user1.fb.name.full, user1:user1
      })
   });


   app.get('/login', function (req, res) {
      res.render('users/login', { title:'Login' });
   });


   app.get('/register', function (req, res) {
      res.render('users/register', { title:'Register to ArashiN' });
   });


   // Handles session Logout
   app.get('/logout', function (req, res) {
      req.logout();
      res.redirect('/');
   });


   // FACEBOOK AUTHENTICATION
   // ==========================================================================================

   // display is the display mode, the way to show the fb login: https://developers.facebook.com/docs/reference/dialogs/oauth/


   // Redirect the user to Facebook for authentication.  When complete,
   // Facebook will redirect the user back to the application at /auth/facebook/callback
   app.get('/auth/facebook', // request permissions for email, user_about_me, user_location
      passport.authenticate('facebook', {
         scope:['email', 'user_status', 'user_about_me', 'user_location']
         //,display: 'popup'
      }), function (req, res) {
         // The request will be redirected to Facebook for authentication, so this
         // function will not be called.
      }
   );


   // Facebook will redirect the user to this URL after approval.  Finish the
   // authentication process by attempting to obtain an access token.  If
   // access was granted, the user will be logged in.  Otherwise,
   // authentication has failed.
   app.get('/auth/facebook/callback',
      passport.authenticate('facebook', {
         successRedirect:'/',
         failureRedirect:'/login',
         failureFlash: 'Login failed!'
      }),
      function (req, res) {
         res.redirect('/');
      }
   );


   // GOOGLE AUTHENTICATION
   // ==========================================================================================

   // Redirect the user to Google for authentication.  When complete, Google
   // will redirect the user back to the application at
   // /auth/google/return
   app.get('/auth/google', passport.authenticate('google'));


   // Google will redirect the user to this URL after authentication.  Finish
   // the process by verifying the assertion.  If valid, the user will be
   // logged in.  Otherwise, authentication has failed.
   app.get('/auth/google/return',
      passport.authenticate('google', {
         successRedirect: '/',
         failureRedirect: '/login',
         failureFlash: true
      }),
      function (req, res) {
         res.redirect('/');
      }
   );



   // TWITTER AUTHENTICATION
   // ==========================================================================================

   // Redirect the user to Twitter for authentication.  When complete, Twitter
   // will redirect the user back to the application at
   // /auth/twitter/callback
   app.get('/auth/twitter', passport.authenticate('twitter'));


   // Twitter will redirect the user to this URL after approval.  Finish the
   // authentication process by attempting to obtain an access token.  If
   // access was granted, the user will be logged in.  Otherwise,
   // authentication has failed.
   app.get('/auth/twitter/callback',
      passport.authenticate('twitter', {
         successRedirect: '/',
         failureRedirect: '/login',
         failureFlash: true
      }),
      function (req, res) {
         res.redirect('/');
      }
   );

};
