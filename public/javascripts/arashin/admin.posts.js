
// setup app
// Note: must include namespace 'ui' to use angular-ui
angular.module('arashin', ['ui', 'arashin.postServices', 'arashin.filters'])
   .config(
      ['$routeProvider', '$locationProvider', function($routeProvider, $location) {
         $routeProvider
            .when('/',          {templateUrl: '/admin/posts/partials/posts-list',  controller: PostListController})
            .when('/new',           {templateUrl: '/admin/posts/partials/post-edit',   controller: PostNewController})
            .when('/:postId',       {templateUrl: '/admin/posts/partials/post-edit',   controller: PostEditController})
            .otherwise({redirectTo: '/'});

         // Don't use this in public sites, thus for google indexing the hashbang is still needed!
         //now there won't be a hashbang within URLs for browers that support HTML5 history
         //$location.html5Mode(true);
      }]
);


// setup rest service
angular.module('arashin.postServices', ['ngResource'])
   .factory('Post', ['$resource', '$http',
      function($resource, $http) {
         return $resource('/api/posts/:postId', {}, {});
      }
]);



// controllers
function PostListController($scope, $routeParams, Post) {

   $scope.posts = Post.query(function(data){
      $scope.hasPosts = data.length > 0;
   });
   $scope.hasPosts = $scope.posts.length > 0;
   var posts = $scope.posts;

   $scope.remove = function (post) {
      var ok = Post.delete({_id: post._id}, function (res) {
         console.log('indexOf: '+ posts.indexOf(post));

         if (res.success) {
            posts.splice(posts.indexOf(post), 1);
         } else {
            alert(JSON.stringify(res.ok));
         }
      })
   };

}
PostListController.$inject = ['$scope', '$routeParams', 'Post'];



function PostNewController($scope, $routeParams, $location, Post) {
   $scope.post = new Post();

   $scope.save = function () {
      Post.save({}, $scope.post, function (res) {
         if (res.success) {
            // notify success
            notify(res.success);
            $location.path("/posts");
         } else {
            // notify error
            notify(res.error, 'error');
            console.log(res.error);
         }
      });
   };

   $scope.cancel = function() {
      $location.path("/posts");
   };

   $scope.isCancelDisabled = function() {
   };

   $scope.isSaveDisabled = function() {
   };

}
PostNewController.$inject = ['$scope', '$routeParams', '$location', 'Post'];



function PostEditController($scope, $routeParams, $location, Post) {
   var master;

   $scope.post = Post.get({postId: $routeParams.postId}, function(post){
      master = post;
   });


   $scope.cancel = function() {
      $scope.form = angular.copy(master);
      $location.path("/");
   };

   $scope.save = function() {
      master = $scope.form;

      Post.save({}, $scope.post, function (res) {
         if (res.success) {
            // notify success
            notify(res.success);
            $location.path("/");
         } else {
            // reset
            $scope.form = angular.copy(master);

            // notify error
            notify(res.error, 'error');
            console.log(res.error);
         }
      });
   };

   $scope.isCancelDisabled = function() {
      return angular.equals(master, $scope.form);
   };

   $scope.isSaveDisabled = function() {
      return $scope.postEditForm.$invalid || angular.equals(master, $scope.form);
   };

//   $scope.cancel();
}
PostEditController.$inject = ['$scope', '$routeParams', '$location', 'Post'];

