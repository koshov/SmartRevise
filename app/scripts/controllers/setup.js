'use strict';

angular.module('SmartReviseApp')
  .controller('SetupCtrl', function ($scope, $location) {
    $scope.steps = [
        {
            'name': 'dates',
            'invalid': function() {
                var start = moment($scope.revisionStart, 'L');
                var end = moment($scope.revisionEnd, 'L');

                return (start.isValid() &&
                        end.isValid() &&
                        end.diff(start, 'days') > 0) ? false : true;
            }
        },
        {
            'name': 'exams',
            'invalid': function() {
                // Kind of a bad hack to use $$childHead
                return $scope.$$childHead.exams.length ? false : true;
            }
        }
    ];
    $scope.currentStep = 0;

    $scope.nextStep = function() {
        if ($scope.currentStep == 0) {
            $scope.currentStep = 1;
        } else if ($scope.currentStep == 1) {
            $location.path( "view" );
        }
    }
    $scope.prevStep = function() {
        $scope.currentStep = 0;
    }

    // Step 1
    $scope.revisionStart = "";
    $scope.revisionEnd = "";

  });
