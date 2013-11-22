'use strict';

angular.module('SmartReviseApp')
  .controller('LandingCtrl', function ($scope, $location) {
    $scope.startSetup = function(){
        console.log('tuk')
        $location.path( "setup" );
    }
  });
