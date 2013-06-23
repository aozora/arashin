//   Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
exports.ensureAuthenticated = function (req, res, next) {
//   console.log('ensureAuthenticated: req.url = ' + req.url);
//   console.log('ensureAuthenticated: req.isAuthenticated() = ' + req.isAuthenticated());

   if (!req.isAuthenticated()) {
      req.flash('notice', 'You are not authorized. Please login');
      res.redirect('/login');
   }

   next();
};



//
///*
// *  User authorizations routing middleware
// */
//
//exports.user = {
//   hasAuthorization:function (req, res, next) {
//      if (req.foundUser.id != req.session.auth.userId) {
//         req.flash('notice', 'You are not authorized');
//         res.redirect('/profile/' + req.foundUser.id);
//      }
//      next();
//   }
//}
//
//
///*
// *  Article authorizations routing middleware
// */
//
//exports.article = {
//   hasAuthorization:function (req, res, next) {
//      if (req.article.user._id.toString() != req.user._id.toString()) {
//         req.flash('notice', 'You are not authorized');
//         res.redirect('/article/' + req.article.id);
//      }
//      next();
//   }
//}
