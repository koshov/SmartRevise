'use strict';

angular.module('SmartReviseApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize'
])
  .config(function ($routeProvider, $locationProvider) {
    // $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/dates', {
        templateUrl: 'views/dates.html',
        controller: 'DatesCtrl'
      })
      .otherwise({
        redirectTo: '/',
      });
  });
