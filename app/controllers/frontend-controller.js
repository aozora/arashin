var current_site = require('../../lib/current-site');

module.exports = function(app, auth){

   // home
   app.get('/', current_site, function(req, res){

      console.dir(req.session.current_site);

      res.render('themes/responsive/home', {
          is_home: true
         ,current_site: req.session.current_site
      });
   });

};


//
//public enum TemplateFile
//{
//   author,
//      contact,
//      index,
//      single,
//      header,
//      footer,
//      sidebar,
//      archive,
//      archives,
//      comments,
//      page,
//      search,
//      searchform,
//      _404,
//      _302,
//      error
//}
//
//
//public enum ViewMode
//{
//   is_post,
//      is_tag,
//      is_category,
//      is_day,
//      is_month,
//      is_year,
//      is_author
//}