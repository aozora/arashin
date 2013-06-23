/**
* SETUP
* this script must run once!
*
* run as: node setup.js
*/
console.log('setup started');
console.log('ENV: ' + process.env.NODE_ENV);

var fs = require('fs')
   ,utils = require('../utils/utils');


// Load configurations
exports = module.exports = config = require('../config').config();
console.log('config: ok');


// init db connection
require('../lib/db-connect');
console.log('require db-connect: ok');


// Bootstrap models
var models_path = __dirname + '/../app/models'
   ,model_files = fs.readdirSync(models_path);

model_files.forEach(function (file) {
   if (file == 'user.js')
      User = require(models_path + '/' + file);
   else if (file !== '.svn')
      require(models_path + '/' + file);
});
console.log('models: ok');


var Theme = mongoose.model('Theme')
   , ThemeSettings = mongoose.model('ThemeSettings')
   , Site = mongoose.model('Site');

// create default site
var themeSettings = [];
themeSettings.push( new ThemeSettings({ key: 'home_headline',     value: 'Hello, World!' }) );
themeSettings.push( new ThemeSettings({ key: 'home_subheadline',  value: 'Your H2 subheadline here' }) );
themeSettings.push( new ThemeSettings({ key: 'home_content_area', value: 'Your title, subtitle and this very content is editable from Theme Option. Call to Action button and its destination link as well. Image on your right can be an image or even YouTube video if you like.' }) );
themeSettings.push( new ThemeSettings({ key: 'cta_button',        value: 'true' }) );
themeSettings.push( new ThemeSettings({ key: 'cta_url',           value: '#nogo' }) );
themeSettings.push( new ThemeSettings({ key: 'cta_text',          value: 'Call to Action' }) );
themeSettings.push( new ThemeSettings({ key: 'featured_content',  value: '<img class="aligncenter" src="/themes/responsive/images/featured-image.png" width="440" height="300" alt="" />' }) );

var theme = new Theme({
    name: 'responsive'
   ,settings: themeSettings
   ,stylesheet_url : '/themes/responsive/'
   ,stylesheet_directory : '/themes/responsive/'
   ,template_url : '/themes/responsive/style.css'
});

theme.save(function(err, doc) {
   if (err) {
      console.dir(err);
   } else {
      console.log('theme created!');
      console.dir(doc);

      // create the site
      var site = new Site({
          name: 'arashin'
         ,title: 'ArashiN for NodeJs'
         ,slogan: 'Simple and light-speed web engine!'
         ,header_image: ''
         ,seo: {
             meta_keywords    : 'arashin cms node nodejs node.js expressjs'
            ,meta_description : 'Simple and light-speed web engine!'
         }
         ,theme: doc._id
      });

      site.save(function(err, savedSite){
         if (err) {
            console.dir(err);
         } else {
            console.log('site created!');
            console.dir(savedSite);
         }
      });
   }
});

// add menus
// add sidebars

// TODO: create default admin user

