'use strict';

angular.module('SmartReviseApp')
  .factory('Session', function ($resource) {
    return $resource('/api/session/');
  });
