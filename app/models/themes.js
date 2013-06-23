// site schema
var mongoose = require('mongoose');

var ThemeSettings = new mongoose.Schema({
    key     : { type: String }
   ,value   : { type: String }
});
mongoose.model('ThemeSettings', ThemeSettings);


var Theme = new mongoose.Schema({
    name                   : { type: String }
   ,settings               : [ThemeSettings]
   ,stylesheet_url         : { type: String }
   ,stylesheet_directory   : { type: String }
   ,template_url           : { type: String }
});

mongoose.model('Theme', Theme);
