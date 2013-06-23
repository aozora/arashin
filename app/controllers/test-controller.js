module.exports = function(app, auth){

  // home
  app.get('/test', function(req, res){

     console.log('request authenticated: ' + req.isAuthenticated());
     console.log('request user: ' + req.user);

     //req.flash('notice', 'Test message... oh yeah!');

     //res.render('test/test', { title: 'My Title', message: req.flash('notice') });
     res.render('test/test', { title: 'My Title' });
  });

};
