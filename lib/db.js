function setup(parameters) {

   var Schema = require('jugglingdb').Schema;
   var schema = new Schema('redis', {port: parameters.redis_port}); //port number depends on your config


   // define models
   var Post = schema.define('Post', {
      title:     { type: String, length: 255 },
      content:   { type: Schema.Text },
      date:      { type: Date, default: Date.now },
      published: { type: Boolean, default: false, index: true },
      author_id: {type: Number}
   });


   Post.belongsTo(User, {as: 'author', foreignKey: 'author_id'});


   var User = schema.define('User', {
         name:       String,
         email:      {type: String, limit: 150, index: true},
         password:   {type: String, limit: 150},
         enabled:    Boolean,
         created: Date
      }
   );


   // setup relationships
   User.hasMany(post, {as: 'posts', foreignKey: 'author_id'});




//   // define models
//   var Post = schema.define('Post', {
//      title:     { type: String, length: 255 },
//      content:   { type: Schema.Text },
//      date:      { type: Date, default: Date.now },
//      published: { type: Boolean, default: false, index: true }
//   });
//
//   // simplier way to describe model
//   var User = schema.define('User', {
//      name:       String,
//      email:      String,
//      password:   String,
//      enabled:    Boolean,
//      created: Date
////   }, {
////      restPath: '/users' // tell WebService adapter which path use as API endpoint
//   }
//   );
//
////   // define any custom method
////   User.prototype.getNameAndAge = function () {
////      return this.name + ', ' + this.age;
////   };
//
////   // models also accessible in schema:
////   schema.models.User;
////   schema.models.Post;
//
//   // setup relationships
//   User.hasMany(Post, {as: 'posts', foreignKey: 'userId'});
//   // creates instance methods:
//   // user.posts(conds)
//   // user.posts.build(data) // like new Post({userId: user.id});
//   // user.posts.create(data) // build and save
//
//   Post.belongsTo(User, {as: 'author', foreignKey: 'userId'});
//   // creates instance methods:
//   // post.author(callback) -- getter when called with function
//   // post.author() -- sync getter when called without params
//   // post.author(user) -- setter when called with object

}

exports.setup = setup(parameters);
