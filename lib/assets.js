// assets.js
module.exports = function(assets) {

   // global bundle
   assets.addJs(__dirname + '/../public/javascripts/bootstrap/bootstrap-transition.js');
   assets.addJs(__dirname + '/../public/javascripts/application.js');

   // global bundle
   assets.addCss(__dirname + '/../public/stylesheets/bootstrap.css');
   assets.addCss(__dirname + '/../public/stylesheets/bootstrap-responsive.css');
   assets.addCss(__dirname + '/../public/stylesheets/font-awesome.css');
   assets.addCss(__dirname + '/../public/stylesheets/styles.css');


   // namespaced bundles for resume page
   assets.addJs(__dirname + '/../public/javascripts/jquery.circularprogress.js', 'resume');
   assets.addJs(__dirname + '/../public/javascripts/jquery.scrollTo.js', 'resume');
   assets.addJs(__dirname + '/../public/javascripts/app.resume.js', 'resume');

};