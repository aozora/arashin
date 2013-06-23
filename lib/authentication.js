var url = require('url')
   ,passport = require('passport')
   ,GoogleStrategy = require('passport-google').Strategy
   ,FacebookStrategy = require('passport-facebook').Strategy
   ,TwitterStrategy = require('passport-twitter').Strategy;

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session.  Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing.  However, since this example does not
//   have a database of user records, the complete Facebook profile is serialized
//   and deserialized.
passport.serializeUser(function(user, done) {
   //done(null, user);
   done(null, user.id);
});

passport.deserializeUser(function(id, done) {
   //done(null, obj);
   User.findOne({id: id}, function (err, user) {
      done(err, user);
   });
});


/* Facebook Strategy
   ------------------------------------- */
passport.use(new FacebookStrategy({
      clientID: config.facebook.appId,
      clientSecret: config.facebook.appSecret,
      callbackURL: config.facebook.host_uri,
      passReqToCallback: true
   },

   function(req, accessToken, refreshToken, profile, done) {

      console.log('calling User.authenticate...');
      User.authenticate(accessToken, refreshToken, profile, function (err, user) {
         if (err) {
            console.log('User.authenticate ERROR:');
            console.dir(err);
            return done(err);
         }

         if (!user) {
            console.log('User.authenticate: UNKNOWN USER');
            return done(null, false, { message: 'Unknown user ' + profile });
         }

         req.session.user = user;

         console.log('User.authenticate: OK!');
         console.dir(user);
         done(null, user);

         console.log('called User.authenticate');
      });

   }

));



/* Google Strategy
 ------------------------------------- */
passport.use(new GoogleStrategy({
      returnURL: config.google.returnURL,
      realm: config.google.realm,
      passReqToCallback: true
   },
   function(req, identifier, profile, done) {

//      User.findOrCreate({ openId: identifier }, function (err, user) {
//         done(err, user);
//      });
      console.log('calling User.authenticate...');
      User.authenticate(identifier, null, profile, function (err, user) {
         if (err) {
            console.log('User.authenticate ERROR:');
            console.dir(err);
            return done(err);
         }

         if (!user) {
            console.log('User.authenticate: UNKNOWN USER');
            return done(null, false, { message: 'Unknown user ' + profile });
         }

         req.session.user = user;

         console.log('User.authenticate: OK!');
         console.dir(user);
         done(null, user);

         console.log('called User.authenticate');
      });

   }
));


/* Twitter Strategy
 ------------------------------------- */
passport.use(new TwitterStrategy({
      consumerKey: config.twitter.consumerKey,
      consumerSecret: config.twitter.consumerSecret,
      callbackURL: config.twitter.callbackURL,
      passReqToCallback: true
   },
   function(req, token, tokenSecret, profile, done) {

//      User.findOrCreate(..., function (err, user) {
//         if (err) { return done(err); }
//         done(null, user);
//      });
      console.log('calling User.authenticate...');
      User.authenticate(token, tokenSecret, profile, function (err, user) {
         if (err) {
            console.log('User.authenticate ERROR:');
            console.dir(err);
            return done(err);
         }

         if (!user) {
            console.log('User.authenticate: UNKNOWN USER');
            return done(null, false, { message: 'Unknown user ' + profile });
         }

         req.session.user = user;

         console.log('User.authenticate: OK!');
         console.dir(user);
         done(null, user);

         console.log('called User.authenticate');
      });

   }
));