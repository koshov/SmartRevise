'use strict';

angular.module('SmartReviseApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.bootstrap.datetimepicker'
])
  .config(function ($routeProvider) {
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
      .otherwise({
        redirectTo: '/',
      });
  })
  // .config(function ($locationProvider) {
  //   $locationProvider.html5Mode(true);
  // });
  .run(function($timeout) {
      $timeout(function() {
          $(document).foundation();
      }, 500);
  });
