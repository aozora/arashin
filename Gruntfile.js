module.exports = function (grunt) {

   // Nodejs libs.
   var fs = require('fs')
      , path = require('path');

   // load tasks
   grunt.loadNpmTasks('grunt-assetify');

   // Project configuration.
   grunt.initConfig({

      assetify: {
         dev: {
            production:  false,
            assets:      {
               source: __dirname + '/public',
               bin: __dirname + '/public/.bin',
               js: [
                  {file: 'js/lodash.js', profile: 'core'},
                  {file: 'js/bootstrap.js', profile: 'core'},
                  {file: 'js/bootstrap-select.js', profile: 'core'},
                  {file: 'js/bootstrap-switch.js', profile: 'core'},
                  {file: 'js/flatui-checkbox.js', profile: 'core'},
                  {file: 'js/flatui-radio.js', profile: 'core'},

                  {file: 'js/admin/admin.core.js', profile: 'admin'},
                  {file: 'js/admin/gnmenu.js', profile: 'admin'}
               ],
               css: [
                  {file: 'css/bootstrap.css', profile: 'core'},
                  {file: 'css/bootstrap-responsive.css', profile: 'core'},
                  {file: 'css/flat-ui.css', profile: 'core'},
                  {file: 'css/font-awesome.css', profile: 'core'},

                  {file: 'css/admin/admin.css', profile: 'admin'}

               ]
            },
            compress:    true,         // disable: false
            fingerprint: false,      // enable: non-development environment or true
            plugins:     {
               less:      true,         // disable: false
               sass:      false,        // enable: true
               coffee:    false,      // enable: true
               jsn:       false,         // enable: true
               forward:   false,     // enable with args array: [{ extnames: ['.txt'] }, true]
               bundle:    false,       // enable: non-development environment or true
               minifyCSS: false,    // enable: non-development environment or true
               minifyJS:  false     // enable: non-development environment or true
            }
         },

         prod: {
            production:  true,
            assets:      {
               source: __dirname + '/public',
               bin: __dirname + '/public/.bin',
               js: [
                  {file: 'js/lodash.js', profile: 'core'},
                  {file: 'js/bootstrap.js', profile: 'core'},
                  {file: 'js/bootstrap-select.js', profile: 'core'},
                  {file: 'js/bootstrap-switch.js', profile: 'core'},
                  {file: 'js/flatui-checkbox.js', profile: 'core'},
                  {file: 'js/flatui-radio.js', profile: 'core'},

                  {file: 'js/admin/admin.core.js', profile: 'admin'},
                  {file: 'js/admin/gnmenu.js', profile: 'admin'}
               ],
               css: [
                  {file: 'css/bootstrap.css', profile: 'core'},
                  {file: 'css/bootstrap-responsive.css', profile: 'core'},
                  {file: 'css/flat-ui.css', profile: 'core'},
                  {file: 'css/font-awesome.css', profile: 'core'},

                  {file: 'css/admin/admin.css', profile: 'admin'}

               ]
            },
            compress:    true,         // disable: false
            fingerprint: true,      // enable: non-development environment or true
            plugins:     {
               less:      true,         // disable: false
               sass:      false,        // enable: true
               coffee:    false,      // enable: true
               jsn:       false,         // enable: true
               forward:   false,     // enable with args array: [{ extnames: ['.txt'] }, true]
               bundle:    true,       // enable: non-development environment or true
               minifyCSS: true,    // enable: non-development environment or true
               minifyJS:  true     // enable: non-development environment or true
            }
         }

      }

   });

   // Default task(s).
   grunt.registerTask('default', [
      'assetify:dev'
   ]);

};