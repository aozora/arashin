module.exports = function(app, auth){

   // Dashboard index
   app.get('/dashboard', auth.ensureAuthenticated, function(req, res){
      res.render('dashboard/index', {
         title: 'Dashboard'
      });
   });

};