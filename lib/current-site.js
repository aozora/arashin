// middleware
var Site = mongoose.model('Site');

module.exports = function(req, res, next) {
      console.log('reading current site...');

      if (req.session.current_site === undefined) {
         console.log('current_site not in session, fetching db...');

         Site
            .findOne({ name : 'arashin' })
            .populate('theme')
            .exec(function(err, site) {
               if (err){
                  console.dir(err);
                  return next(err);
               }

               if (!site){
                  console.log('reading current site failed!');
                  return next(new Error('Failed to load site arashin'));
               }

               console.log("reading current site: ok!");
               //console.dir(site);

               req.session.current_site = site;
               //req.locals.current_site = site;
               next();
            });

      } else {
         console.log('current_site is in session...');
         //req.locals.current_site = req.session.current_site;
         next();
      }


};


//
//var currentSite = function(){
//   console.log('reading current site...');
//
//   Site
//      .findOne({ name : 'arashin' })
//      .populate('theme')
//      .exec(function(err, site) {
//         if (err){
//            console.dir(err);
//            return next(err);
//         }
//
//         if (!site){
//            console.log('reading current site failed!');
//            return next(new Error('Failed to load site arashin'));
//         }
//
//         console.log("reading current site: ok!");
//         console.dir(site);
//         return site;
//      });
//
//};
//
//module.exports = currentSite;