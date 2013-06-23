// site schema
var mongoose = require('mongoose');

var Site = new mongoose.Schema({

    name                : { type: String, index: { unique: true } }
   ,title               : { type: String }
   ,slogan              : { type: String }
   ,header_image        : { type: String }
   ,seo: {
       meta_keywords    : { type: String }
      ,meta_description : { type: String }
   }
   ,theme               : { type : mongoose.Schema.ObjectId, ref : 'Theme' }
});

mongoose.model('Site', Site);
