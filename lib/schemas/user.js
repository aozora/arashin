function init(parameters) {

   var Schema = require('jugglingdb').Schema;
   var schema = new Schema('redis', {port: parameters.redis_port}); //port number depends on your config
   var post = require

   var User = schema.define('User', {
         name:       String,
         email:      String,
         password:   String,
         enabled:    Boolean,
         created: Date
      }
   );



}