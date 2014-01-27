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
        $location.path( 'view' );
    };

    $scope.exams = []
    $http.get('/api/exams')
        .success(function(exams) {
            $scope.exams = exams;
        });

    $scope.addExam = function() {
        // TODO: validate name first!
        var exam = {
            title: $scope.examName,
            date: ''
        };
        $http.post('/api/exams/add/', exam)
            .success(function(exams) {
                $scope.exams.push(exam);
                $scope.examName = '';
            });
    };

    $scope.hasDate = function(index) {
        if ($scope.exams[index].date == '') {
            return true;
        }
        return false;
    };

    $scope.removeExam = function(index) {
        $scope.exams.splice(index,1);
        $http.get('/api/exams/del/' + $scope.exams[index].title)
            .success(function(exams) {
                $http.get('/api/exams')
                    .success(function(exams) {
                        $scope.exams = exams;
                    });
            });
    };

  });
