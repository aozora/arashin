var passport = require('passport')
   ,mongoose = require('mongoose')
   ,url = require('url')
   ,qs = require('querystring')
   ,User;


// Define user schema with base fields for all providers (Passport User Profile)
var UserSchema = new mongoose.Schema({
    id:           { type: String, required: true }
   ,provider:     { type: String, required: true }
   ,profileUrl:   { type: String, required: false }
   ,name: {
       displayName:  { type: String, required: true }
      ,firstName:    { type: String, required: true }
      ,lastName:     { type: String, required: true }
      ,middleName:   { type: String, required: false }
   }
   ,email:        { type: String, required: true }
   ,created_at:   { type: Date, required: true, default : Date.now() }
});


UserSchema.static('authenticate', function(accessToken, refreshToken, profile, callback) {
   console.log('accessToken = ' + accessToken);
   //console.log('refreshToken = ' + refreshToken);
//   console.dir(profile);

   // profile normalization for google provider
   if (profile.id === undefined){
      var gUrl = url.parse(accessToken, true);

      profile.id = gUrl.query.id;
      profile.provider = "google";
      profile.profileUrl = accessToken;
   }

   console.dir(profile);
   console.log('calling User.findOne: id = ' + profile.id);


   // TODO Check user in session or request helper first
   //      e.g., req.user or sess.auth.userId
   this.findOne({id: profile.id}, function (err, foundUser) {

      console.log('User.findOne: id = ' + profile.id);

      if (err) {
         return callback(err);
      }

      // FOR NOW DON'T DO THIS.....LET CREATE USER IF NOT FOUND
      if (!foundUser) {
         return callback(null, false);
      }

      // if the user already exists return it
      if (foundUser) {
         console.log('user found!');
         return callback(null, foundUser);
      }

      console.log("Creating USER");

      User = mongoose.model('User');

      var user = new User({
          id: profile.id
         ,provider: profile.provider
         ,profileUrl: profile.profileUrl
         ,name: {
            displayName: profile.displayName == undefined ? profile.name.givenName : profile.displayName
            ,firstName: profile.name.givenName
            ,lastName: profile.name.familyName
            ,middleName: profile.name.middleName
         }
         ,email: profile.emails.length > 0 ? profile.emails[0].value : ''
         ,created_at: Date.now()
      });


      user.save( function (err, savedUser) {
         if (err){
            console.log('user.save failed');
            console.dir(err);
            return callback(err);
         }
         else
         {
            return callback(null, user);
         }
      })
   });

//   // boh
//   console.log('boh.......');
//   return callback(null, false);
});




// validations (don't need this now, all user data are for external providers

//UserSchema.path('fb.name.full').validate(function (value, respond) {
//   respond( value.trim().split(' ').length >= 2 );
//}, 'Please provide your fullname');
//
//UserSchema.path('fb.email').validate(function (value, respond) {
//   respond( /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/i.test(value) );
//}, 'Please provide a proper email');


// virtual attributes

var exports = module.exports = User = mongoose.model('User', UserSchema);
