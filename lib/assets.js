function configure(js, css){

   // note: paths have trailing dots 'cause here __dirname is ./lib, not the root


   // CSS Assets
   // =============================================================================

   // core css
   css.addFile('core', __dirname + '/../public/css/bootstrap.css');
   css.addFile('core', __dirname + '/../public/css/bootstrap-responsive.css');
   css.addFile('core', __dirname + '/../public/css/font-awesome.min.css');
   css.addFile('core', __dirname + '/../public/css/flat-ui.css');

   // admin css
   css.addFile('admin', __dirname + '/../public/css/admin/admin.css');



   // Javascript Assets
   // =============================================================================

   // core js
   //js.addUrl('core', 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.js');
   js.addFile('core', __dirname + '/../public/js/jquery-1.10.2.js');
   js.addFile('core', __dirname + '/../public/js/lodash.js');
   js.addFile('core', __dirname + '/../public/js/bootstrap.js');
   js.addFile('core', __dirname + '/../public/js/bootstrap-select.js');
   js.addFile('core', __dirname + '/../public/js/bootstrap-switch.js');
   js.addFile('core', __dirname + '/../public/js/flatui-checkbox.js');
   js.addFile('core', __dirname + '/../public/js/flatui-radio.js');


   // admin js
   js.addFile('admin',  __dirname + '/../public/js/admin/admin.core.js');
   js.addFile('admin',  __dirname + '/../public/js/admin/gnmenu.js');

}


exports.configure = configure;