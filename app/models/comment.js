// comment schema

var Comments = new Schema({
    body        : {type : String, default : ''}
  , content     : {type : Schema.ObjectId, ref : 'Content'}
  , user        : {type : Schema.ObjectId, ref : 'User'}
  , created_at  : {type : Date, default : Date.now}
});

mongoose.model('Comment', Comments);
