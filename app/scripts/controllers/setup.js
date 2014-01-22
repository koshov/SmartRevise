'use strict';

angular.module('SmartReviseApp')
  .controller('SetupCtrl', function ($scope, $http, $location) {

    $scope.step = {
        name: 'exams',
        invalid: function() {
            return $scope.exams.length ? false : true;
        }
    };

    $scope.nextStep = function() {
        $location.path( "view" );
    };

    $scope.exams = []
    $http.get('/api/exams')
        .success(function(exams) {
            $scope.exams = exams;
        });

    $scope.addExam = function() {
        // TODO: validate name first!
        $http.get('/api/exams/add/' + $scope.examName)
            .success(function(exams) {
                $scope.exams.push({
                    title: $scope.examName,
                    date: ""
                });
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
