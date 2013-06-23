var Content = mongoose.model('Content')
   , Comment = mongoose.model('Comment');

module.exports = function(app, auth){


//
//   app.param('id', function(req, res, next, id){
//      console.log('request for postId = ' + id );
//      console.log('request for req.params.id = ' + req.params.id );
//
//      Post
//            .findOne({ _id : req.params.id })
//            .populate('user')
//            .exec(function(err, post) {
//               if (err)
//                  return next(err);
//
//               if (!post)
//                  return next(new Error('Failed to load post ' + id));
//
//               req.post = post;
//
////               Comment
////                  .find({article : req.article})
////                  .populate('user')
////                  .exec(function (err, comments) {
////                     if (err)
////                        throw err;
////
////                     req.comments = comments;
////                     next();
////                  });
//            });
//
//   });


   // show the posts page
   app.get('/admin/posts/index', auth.ensureAuthenticated, function(req, res){

      console.log('request GET for /admin/posts');

      res.render('posts/index', {
         title: 'My Posts'
      });
   });


   /* REST methods for Post
   --------------------------------------- */

   // Get single Post
   app.get('/api/posts/:id', auth.ensureAuthenticated, function(req, res){
      Content
         .findOne({ _id : req.params.id })
         .populate('user')
         .exec(function(err, post) {
            if (err)
               return next(err);

            if (!post)
               return next(new Error('Failed to load post ' + id));

            //req.post = post;
            res.send(post);
            //               Comment
            //                  .find({article : req.article})
            //                  .populate('user')
            //                  .exec(function (err, comments) {
            //                     if (err)
            //                        throw err;
            //
            //                     req.comments = comments;
            //                     next();
            //                  });
         });
   });



   // Listing of Articles (main page)
   app.get('/api/posts', auth.ensureAuthenticated, function(req, res){
      Content
         .find({})
         .populate('user')
         .sort({ created_at: 'desc'})  // sort by date
         .exec(function(err, posts) {
            if (err){
               console.dir(err);
               throw err;
            }

//            console.log('Posts: ');
//            console.dir(posts);

            res.send(posts);
         });

   });



//   // Update post
//   app.post('/api/posts/:id', auth.ensureAuthenticated, function(req, res){
//
//      Post
//         .findOne({ _id : req.params.id })
//         .populate('user')
//         .exec(function(err, post) {
//            if (err)
//               return next(err);
//
//            if (!post)
//               return next(new Error('Failed to load post ' + id));
//
//
//            post.title = req.body.post.title;
//            post.body = req.body.post.body;
//
//            post.save(function(err, doc) {
//               var doc;
//
//               if (err) {
//                  // this use req.flash()
//                  // utils.mongooseErrorHandler(err, req);
//
//                  if (err.message) {
//                     doc = {error : err.message}
//                  } else {
//                     doc = {error : JSON.stringify(err)}
//                  }
//               }
//               else {
//                  doc = {success : 'Post saved successfully'};
//               }
//
//               res.json(doc);
//
//            });
//
//         });
//
//   });



   // save post
   app.post('/api/posts', function(req, res){

      if (req.body._id){
         console.log('updating post');

         Content
            .findOne({ _id : req.body._id })
            .populate('user')
            .exec(function(err, post) {
               if (err)
                  return next(err);

               if (!post)
                  return next(new Error('Failed to load post ' + req.body._id));

               post.title = req.body.title;
               post.body = req.body.body;

               post.save(function(err, doc) {
                  var doc;

                  if (err) {
                     // this use req.flash()
                     // utils.mongooseErrorHandler(err, req);

                     if (err.message) {
                        doc = {error : err.message}
                     } else {
                        doc = {error : JSON.stringify(err)}
                     }
                  }
                  else {
                     doc = {success : 'Post saved successfully'};
                  }

                  res.json(doc);

               });

            });

      } else {

         console.log('creating new post');

         var post = new Post(req.body);

         // assign the current user id
         post.user = req.user._id;

         post.save(function(err){
            var doc;

            if (err) {
               // this use req.flash()
               // utils.mongooseErrorHandler(err, req);

               if (err.message) {
                  doc = {error : err.message}
               } else {
                  doc = {error : JSON.stringify(err)}
               }
            }
            else {
               doc = {success : 'Post created successfully'};
            }

            res.json(doc);
         });

      }

   });






   //   // Delete an article
   //   app.del('/article/:id', auth.ensureAuthenticated, function(req, res){
   //      var article = req.article;
   //
   //      article.remove(function(err){
   //         // req.flash('notice', 'Deleted successfully')
   //         res.redirect('/articles');
   //      })
   //   });

   /* END REST methods for Post
    --------------------------------------- */

   // partials
   app.get('/admin/posts/partials/posts-list', auth.ensureAuthenticated, function(req, res){
      res.render('posts/partials/posts-list');
   });
   app.get('/admin/posts/partials/post-edit', auth.ensureAuthenticated, function(req, res){
      res.render('posts/partials/post-edit');
   });


};




//   // Create an article
//   app.post('/admin/posts', function(req, res){
//      var post = new Post(req.body.post);
//
//      //post.user = req.session.auth.userId;
//
//      article.save(function(err){
//         if (err) {
//            utils.mongooseErrorHandler(err, req);
//            res.render('admin/posts/new', {
//               title: 'New Post'
//               , article: article
//            });
//         }
//         else {
//            req.flash('notice', 'Created successfully');
//            res.redirect('/article/'+article._id);
//         }
//      })
//   });



//   // Edit an article
//   app.get('/article/:id/edit', auth.ensureAuthenticated, function(req, res){
//      res.render('articles/edit', {
//         title: 'Edit '+req.article.title,
//         article: req.article
//      });
//   });



//   // Update article
//   app.put('/articles/:id', auth.ensureAuthenticated, function(req, res){
//      var article = req.article;
//
//      article.title = req.body.article.title;
//      article.body = req.body.article.body;
//
//      article.save(function(err, doc) {
//         if (err) {
//            utils.mongooseErrorHandler(err, req);
//
//            res.render('articles/edit', {
//               title: 'Edit Article'
//               , article: article
//            });
//         }
//         else {
//            req.flash('notice', 'Updated successfully');
//            res.redirect('/article/'+article._id);
//         }
//      })
//   });



//   // View an article
//   app.get('/article/:id', function(req, res){
//      res.render('articles/show', {
//         title: req.article.title,
//         article: req.article,
//         comments: req.comments
//      });
//   });


//
//   // Delete an article
//   app.del('/article/:id', auth.ensureAuthenticated, function(req, res){
//      var article = req.article;
//
//      article.remove(function(err){
//         // req.flash('notice', 'Deleted successfully')
//         res.redirect('/articles');
//      })
//   });