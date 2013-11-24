'use strict';

angular.module('SmartReviseApp')
  .controller('LandingCtrl', function ($scope, $location) {
    $scope.startSetup = function(){
        $location.path( "setup" );
    }
  });
