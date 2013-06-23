var _ = require('underscore');

module.exports = function(req, res) {

   var helpers = {

      wp_title: function() {
         var titleFormat = config.seo.posttitleformat;
         //   if (post) {
         //      return titleFormat.replace('%post_title%', post.title)
         //         .replace('blog_title', config.app.name);
         //   }
         //return config.app.name;
         return req.session.current_site.title;
      },


      wp_head: function(){
         var site = req.session.current_site;
         var buf = [];

         buf.push('<meta name="keywords" content="' + site.seo.meta_keywords + '" />');
         buf.push('<meta name="description" content="' + site.seo.meta_description + '" />');
         buf.push('<link rel="canonical" href="' + req.url + '" />');

         return buf.join('\n');
      },


      wp_footer: function() {
         return '';
      },


      bloginfo: function(parameter) {
         var site = req.session.current_site;

         switch (parameter)
         {
            case 'home':
               return req.host; // Html.Raw(GetCurrentSiteUrlRoot());
            case 'url':
               return req.url; //Html.Raw(Request.Url.ToString());
            case 'html_type':
               return 'text/html';
            case 'charset':
               //return 'iso-8859-1';
               return 'utf-8';
            case 'template_url':
            case 'template_directory':
               return site.theme.template_url; //Html.Raw(GetAbsoluteUrl(VirtualPathUtility.ToAbsolute(Model.Site.Theme.BasePath)));
            case 'stylesheet_directory':
               return site.theme.stylesheet_directory; //Html.Raw(GetAbsoluteUrl(VirtualPathUtility.ToAbsolute(Model.Site.Theme.BasePath)));
            case 'stylesheet_url':
               return site.theme.stylesheet_url; //Html.Raw(GetAbsoluteUrl(VirtualPathUtility.ToAbsolute(string.Concat(Model.Site.Theme.BasePath, '/style.css'))));
            case 'name':
               return site.title; //Html.Raw(Html.Encode(Model.Site.Name));
            case 'description':
               return site.slogan; //Html.Raw(Html.Encode(Model.Site.Description));
            case 'rss2_url':
               return req.host + '/feed/'; //Html.Raw(GetCurrentSiteUrlRoot() + '/feed/');
            case 'atom_url':
               return req.host + '/feed/atom/'; //Html.Raw(GetCurrentSiteUrlRoot() + '/feed/atom/');
            case 'pingback_url':
               return req.host + '/pingback'; //Html.Raw(GetCurrentSiteUrlRoot() + '/pingback.axd');
            case 'text_direction':
               return 'ltr'; //TODO: Implement text_direction!!!
            default:
               return '';
         }
      },


      body_class: function (){
         // TODO: generate full support for body_class !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

         //   string controller = ViewContext.RouteData.Values["controller"].ToString().ToLower();
         //   string action = ViewContext.RouteData.Values["action"].ToString().ToLower();
         //   string bodyClass = string.Empty;
         //
         //   switch (controller)
         //   {
         //      case "post":
         //         if (action == "index")
         //         {
         //            bodyClass = "home blog";
         //         }
         //         else if (action == "single")
         //         {
         //            bodyClass = "single";
         //         }
         //         break;
         //      case "category":
         //         bodyClass = "category";
         //         break;
         //      case "tag":
         //         bodyClass = "tag";
         //         break;
         //      case "archives":
         //         bodyClass = "archives";
         //         break;
         //   }
         //
         //   return Html.Raw(string.Format("class=\"{0}\"", bodyClass));
         return 'home';
      },


      get_option: function(option){
         var theme = req.session.current_site.theme;

         var o = _.find(theme.settings, function(s){
            return s.key === option;
         });

         if (o === undefined)
            return '';

         return o.value;
      },


      /* THE LOOP
       * ******************************** */

      have_posts: function(){
         if (posts !== undefined && posts.length > 0)
            return true;

         return false;
      },


      the_post: function(post){
         res.locals.current_post = post;
         return true;
      },


      the_ID: function(){
         return res.locals.current_post._id;
      },


      the_title: function(){

      },


      post_class: function(){

      },


      the_content: function(){

      },


      get_permalink: function(){

      },


      get_the_time: function(){

      },


      get_the_date: function(){

      },


      get_author_posts_url: function(){

      },


      get_the_author_meta: function(){

      },


      get_the_author: function(){

      },


      comments_open: function(){

      },


      comments_popup_link: function(){

      },


      wp_link_pages: function(){

      },




      the_tags: function(){

      },


      the_category: function(){

      },


      edit_post_link: function(){

      },


      comments_template: function(){

      }


      /* END THE LOOP
       * ******************************** */




   };

   return helpers;

//
//   function createSlugFromTitle(title) {
//      return title
//         .toLowerCase() // change everything to lowercase
//         .replace(/^\s+|\s+$/g, "") // trim leading and trailing spaces
//         .replace(/[_|\s]+/g, "-") // change all spaces and underscores to a hyphen
//         .replace(/[^a-z\u0400-\u04FF0-9-]+/g, "") // remove all non-cyrillic, non-numeric characters except the hyphen
//         .replace(/[-]+/g, "-") // replace multiple instances of the hyphen with a single instance
//         .replace(/^-+|-+$/g, "") // trim leading and trailing hyphens
//         .replace(/[-]+/g, "-")
//   }






};


