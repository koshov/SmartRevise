'use strict';

angular.module('SmartReviseApp')
  .controller('SetupCtrl', function ($scope, $http, $location) {
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
                return $scope.exams.length ? false : true;
            }
        }
    ];
    $scope.currentStep = 0;

    $scope.nextStep = function() {
        if ($scope.currentStep == 0) {
            $scope.setDates();
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

    $scope.setDates = function() {
        var start = moment($scope.revisionStart).format('YYYY-MM-DD');
        var end = moment($scope.revisionEnd).format('YYYY-MM-DD');
        $http.get('/api/dates/set/' + start + '/' + end);
    }

    // Step 2
    $scope.exams = []
    $http.get('/api/exams')
        .success(function(exams) {
            $scope.exams = exams;
        });

    $scope.addExam = function() {
        // TODO: validate name first!
        $http.get('/api/exams/add/' + $scope.examName)
            .success(function(exams) {
                $scope.exams.push({title:$scope.examName});
                $scope.examName = '';
            });
    };

    $scope.removeExam = function(index) {
        $http.get('/api/exams/del/' + $scope.exams[index].title)
            .success(function(exams) {
                $scope.exams.splice(index,1);
                $http.get('/api/exams')
                    .success(function(exams) {
                        $scope.exams = exams;
                    });
            });
    }

  });
