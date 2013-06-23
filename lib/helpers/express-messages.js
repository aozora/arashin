/*!
* Express - Contrib - messages
* Copyright(c) 2010 TJ Holowaychuk <tj@vision-media.ca>
* MIT Licensed
*/
exports.messages = function(req, res){
   return function(){

      var buf, i, j, len, messages, msg, msgs, type, types, _i, _j, _ref;
      buf = [];
      messages = req.flash();
      types = Object.keys(messages);
      len = types.length;

      if (!len) {
         return '<div id=\"alerts\"></div>';
      }

      buf.push('<div id="alerts">');

      for (i = _i = 0; 0 <= len ? _i < len : _i > len; i = 0 <= len ? ++_i : --_i) {
         type = types[i];
         msgs = messages[type];

         if (msgs != null) {
            for (j = _j = 0, _ref = msgs.length; 0 <= _ref ? _j < _ref : _j > _ref; j = 0 <= _ref ? ++_j : --_j) {
               msg = msgs[j];
               buf.push("<div class=\"alert alert-" + type + "\">");
               buf.push("<button class=\"close\" data-dismiss=\"alert\" type=\"button\">&times;</button>");
               buf.push(msg);
               buf.push("</div>");
            }
         }
      }

      buf.push("</div>");
      return buf.join('\n');
   }
};
