/*
 * MuContent
 *
 * This library is based on hbs library: 
 * Allow multisiste view system
 *
 */


// builtin
var fs = require('fs');
var path = require('path');

// handle async helpers
var async = require('./async');

// expose handlebars, allows users to use their versions
// by overriding this early in their apps
exports.handlebars = require('handlebars');

// cache for templates, express 3.x doesn't do this for us
var cache = {};

// express 3.x template engine compliance
exports.__express = function(filename, options, cb) {
  var handlebars = exports.handlebars;

  // grab extension from filename
  // if we need a layout, we will look for one matching out extension
  var extension = path.extname(filename);

  // render the original file
  // cb(err, str)
  function render_file(locals, cb) {
    // cached?
    var template = cache[filename];
    if (template) {
      return cb(null, template(locals));
    }

    fs.readFile(filename, 'utf8', function(err, str){
      if (err) {
        return cb(err);
      }

      var locals = options;
      var template = handlebars.compile(str);
      if (options.cache) {
        cache[filename] = template;
      }

      var res = template(locals);
      async.done(function(values) {
        Object.keys(values).forEach(function(id) {
          res = res.replace(id, values[id]);
        });

        cb(null, res);
      });
    });
  }

  // render with a layout
  function render_with_layout(template, locals, cb) {
    render_file(locals, function(err, str) {
      if (err) {
        return cb(err);
      }

      var locals = options;
      locals.body = str;

      var res = template(locals);
      async.done(function(values) {
        Object.keys(values).forEach(function(id) {
          res = res.replace(id, values[id]);
        });

        cb(null, res);
      });
    });
  }

  // options.layout specified and false (don't use layout)
  if (options.layout !== undefined && !options.layout) {
    return render_file(options, cb);
  }
  
  // This allow the view path for multiste, in options you can find res.locals variable
  // For example: options.mapping
  var view_dir = options.settings.views;

  var layout_filename = path.join(view_dir, options.layout || 'layout' + extension);

  var layout_template = cache[layout_filename];
  if (layout_template) {
    return render_with_layout(layout_template, options, cb);
  }

  // TODO check if layout path has .hbs extension

  fs.readFile(layout_filename, 'utf8', function(err, str) {
    if (err) {
      return cb(err);
    }

    var layout_template = handlebars.compile(str);
    if (options.cache) {
      cache[layout_filename] = layout_template;
    }

    render_with_layout(layout_template, options, cb);
  });
}

/// expose useful methods

exports.registerHelper = function () {
  exports.handlebars.registerHelper.apply(exports.handlebars, arguments);
};

exports.registerPartial = function () {
  exports.handlebars.registerPartial.apply(exports.handlebars, arguments);
};

exports.registerAsyncHelper = function(name, fn) {
  exports.handlebars.registerHelper(name, function(context) {
    return async.resolve(fn, context);
  });
};
