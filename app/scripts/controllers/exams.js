'use strict';

angular.module('SmartReviseApp')
    .controller('ExamsCtrl', function ($scope, $http) {
        $scope.exams = []
        $http.get('/api/exam')
            .success(function(exams) {
                $scope.exams = exams;
            });

        $scope.addExam = function() {
            // TODO: validate name first!
            $http.get('/api/exam/add/' + $scope.examName)
                .success(function(exams) {
                    $scope.exams.push({name:$scope.examName});
                    $scope.examName = '';
                });
        };

        $scope.removeExam = function(index) {
            $http.get('/api/exam/del/' + $scope.exams[index].name)
                .success(function(exams) {
                    $scope.exams.splice(index,1);
                    $http.get('/api/exam')
                        .success(function(exams) {
                            $scope.exams = exams;
                        });
                });
        }


    });
