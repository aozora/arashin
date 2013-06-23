var mongoose = require('mongoose');


// Content schema
var ContentSchema = new mongoose.Schema({
     title        : { type : String, default : '', trim : true, required: true }
   , slug         : { type : String, default : '', trim : true, required: true }
   , type  : { type : String, default : 'post', required: true }
   , body         : { type : String, default : '', required: true }
   , summary      : { type : String, default : '' }
   , tags         : [String]
   , allowComments: { type: Boolean, default: true }
   , user         : { type : mongoose.Schema.ObjectId, ref : 'User', required: true }
   , seo: {
       meta_keywords     : { type: String }
      ,meta_description  : { type: String }
     }
   , created_at   : { type : Date, default : Date.now(), required: true }
   , edited_at    : { type : Date }
   , published_at : { type : Date }
   , isDeleted    : { type: Boolean, default: false, required: true }
});


// Validation
ContentSchema.path('title').validate(function (title) {
   return title.length > 0;
}, 'Post title cannot be blank');

ContentSchema.path('body').validate(function (body) {
   return body.length > 0;
}, 'Post body cannot be blank');


mongoose.model('Content', ContentSchema);
