function init(parameters) {

   var Schema = require('jugglingdb').Schema;
   var schema = new Schema('redis', {port: parameters.redis_port}); //port number depends on your config

   // define models
   var Post = schema.define('Post', {
      title:     { type: String, length: 255 },
      content:   { type: Schema.Text },
      date:      { type: Date, default: Date.now },
      published: { type: Boolean, default: false, index: true }
   });



}