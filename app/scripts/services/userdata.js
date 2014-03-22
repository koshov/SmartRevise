'use strict';

angular.module('SmartReviseApp')
  .factory('Userdata', function ($resource) {
    return $resource('/api/users/data/:id', {
        id: '@id'
      }, {
        update: {
          method: 'POST',
          params: {}
        },
        get: {
          method: 'GET',
          params: {}
        }
    });
  });
