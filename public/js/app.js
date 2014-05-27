angular.module('contacts', ['ngRoute', 'contacts.factory', 'contacts.filters', 'ui.bootstrap']).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.
      when('/', {
        templateUrl: '/p/list',
        controller: ListCtrl,
      }).
      otherwise({
        redirectTo: '/'
      });
    $locationProvider.html5Mode(true);
  }]).run(function($templateCache, $http){
        $http.get('/p/add-contact', {cache:$templateCache});
        $http.get('/p/view-contact', {cache:$templateCache});
        $http.get('/p/edit-contact', {cache:$templateCache});
        $http.get('/p/delete-contact', {cache:$templateCache});
    });
