'use strict';

angular.module('SmartReviseApp')
  .controller('SetupCtrl', function ($scope, $http) {
    $scope.steps = [
        {
            'name': 'dates',
            'invalid': true
        },
        {
            'name': 'exams'
        }
    ];
    $scope.currentStep = 0;

    $scope.nextStep = function() {
        $scope.currentStep = 1;
    }

    $scope.prevStep = function() {
        $scope.currentStep = 0;
    }

  });
