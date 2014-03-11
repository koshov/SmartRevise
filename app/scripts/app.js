'use strict';

angular.module('SmartReviseApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.bootstrap.datetimepicker'
])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/landing.html',
        controller: 'LandingCtrl'
      })
      .when('/setup', {
        templateUrl: 'views/setup.html',
        controller: 'SetupCtrl'
      })
      .when('/view', {
        templateUrl: 'views/view.html',
        controller: 'ViewCtrl'
      })
      .when('/login', {
        templateUrl: 'partials/login',
        controller: 'LoginCtrl'
      })
      .when('/signup', {
        templateUrl: 'partials/signup',
        controller: 'SignupCtrl'
      })
      .when('/settings', {
        templateUrl: 'partials/settings',
        controller: 'SettingsCtrl',
        authenticate: true
      })
      .otherwise({
        redirectTo: '/',
      });

      $locationProvider.html5Mode(true);

      // // Intercept 401s and 403s and redirect you to login
      // $httpProvider.interceptors.push(['$q', '$location', function($q, $location) {
      //   return {
      //     'responseError': function(response) {
      //       if(response.status === 401 || response.status === 403) {
      //         $location.path('/login');
      //         return $q.reject(response);
      //       }
      //       else {
      //         return $q.reject(response);
      //       }
      //     }
      //   };
      // }]);
  })
  .run(function($timeout) {
      $timeout(function() {
          $(document).foundation();
      }, 500);
  })
  .run(function ($rootScope, $location, Auth) {

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$routeChangeStart', function (event, next) {

      if (next.authenticate && !Auth.isLoggedIn()) {
        $location.path('/login');
      }
    });
  });
