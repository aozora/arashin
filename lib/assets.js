function configure(js, css){

   // note: paths have trailing dots 'cause here __dirname is ./lib, not the root


   // CSS Assets
   // =============================================================================

   // core css
   css.addFile('admin_core', __dirname + '/../admin/public/css/bootstrap.css');
   css.addFile('admin_core', __dirname + '/../admin/public/css/bootstrap-responsive.css');
   css.addFile('admin_core', __dirname + '/../admin/public/css/font-awesome.min.css');
   css.addFile('admin_core', __dirname + '/../admin/public/css/flat-ui.css');

   // admin css
   css.addFile('admin_dashboard', __dirname + '/../admin/public/css/admin/admin.css');



   // Javascript Assets
   // =============================================================================

   // core js
   //js.addUrl('core', 'http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.js');
   js.addFile('admin_modernizer', __dirname + '/../admin/public/js/modernizr-2.6.2.min.js');

   js.addFile('admin_core', __dirname + '/../admin/public/js/jquery-1.10.2.js');
   js.addFile('admin_core', __dirname + '/../admin/public/js/lodash.js');
   js.addFile('admin_core', __dirname + '/../admin/public/js/bootstrap.js');
   js.addFile('admin_core', __dirname + '/../admin/public/js/bootstrap-select.js');
   js.addFile('admin_core', __dirname + '/../admin/public/js/bootstrap-switch.js');
   js.addFile('admin_core', __dirname + '/../admin/public/js/flatui-checkbox.js');
   js.addFile('admin_core', __dirname + '/../admin/public/js/flatui-radio.js');


   // admin js
   js.addFile('admin_dashboard',  __dirname + '/../admin/public/js/admin.core.js');
   js.addFile('admin_dashboard',  __dirname + '/../admin/public/js/gnmenu.js');

}


exports.configure = configure;