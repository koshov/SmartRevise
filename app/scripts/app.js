'use strict';

angular.module('SmartReviseApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize'
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
