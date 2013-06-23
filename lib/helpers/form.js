var helpers = {
   linkTo: function(text, url, options) {
      options = options || {};
      options.href = url;

      return "<a " + hashToAttributes(options) + ">" + text + "</a>";
   },
   cssTag: function(path, options) {
      options = options || {};
      options.rel = 'stylesheet';
      options.href = path;
      options.type = 'text/css';
      options.charset = 'utf-8';

      return "<link " + hashToAttributes(options) + ">";
   },
   jsTag: function(path, options) {
      options = options || {};
      options.type = 'text/javascript';
      options.src = path;
      options.charset = 'utf-8';

      return "<script " + hashToAttributes(options) + "></script>";
   },
   label: function(name, text, options) {
      options = options || {};
      options.for = name;

      return "<label " + hashToAttributes(options) + ">" + text + "</label>";
   },
   submitTag: function(text, options) {
      options = options || {};
      options.type = 'submit';
      options.value = text;

      return "<input " + hashToAttributes(options) + ">";
   },
   imageTag: function(src, options) {
      options = options || {};
      options.src = src;

      return "<img " + hashToAttributes(options) + " />";
   },
   require: require
};

var hashToAttributes = function(hash) {
   var result = [];
   for(var key in hash) {
      var value = hash[key];
      if((value != null) && (typeof value != 'undefined')) {
         result.push(key + "='" + value + "'");
      }
   }
   return result.join(" ");
};

var types = ['text', 'password'];
types.forEach(function(type) {
   helpers[type + 'Field'] = function(name, value, options) {
      options = options || {};
      options.type = type;
      options.name = name;
      options.value = value;

      return "<input " + hashToAttributes(options) + ">";
   }
});

module.exports = helpers;