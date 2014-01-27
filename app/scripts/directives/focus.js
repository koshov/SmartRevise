'use strict';

angular.module('SmartReviseApp')
  .directive('focus', function () {
    return {
      link: function(scope, element, attrs) {
        element[0].focus();
      }
    };
  });
