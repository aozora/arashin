$(function () {

   // Remove the ugly Facebook appended hash
   // <https://github.com/jaredhanson/passport-facebook/issues/12>
   if (window.location.hash && window.location.hash === "#_=_") {
      // If you are not using Modernizr, then the alternative is:
      //   `if (window.history && history.pushState) {`
      if (Modernizr.history) {
         window.history.pushState("", document.title, window.location.pathname);
      } else {
         // Prevent scrolling by storing the page's current scroll offset
         var scroll = {
            top: document.body.scrollTop,
            left: document.body.scrollLeft
         };
         window.location.hash = "";
         // Restore the scroll offset, should be flicker free
         document.body.scrollTop = scroll.top;
         document.body.scrollLeft = scroll.left;
      }
   }
});



function notify(message, type, closable){

   var defaults = {
      message: { text: '' },
      type: 'success',
      closable: true,
      fadeOut: { enabled: true, delay: 3000}
   };

   var options = {
      message: { text: message },
      type: type,
      closable: closable,
      fadeOut: { enabled: closable}
   };

   var notifyOptions  = $.extend({}, defaults, options);

   $('.notifications').notify(notifyOptions).show();
}