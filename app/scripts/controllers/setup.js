'use strict';

angular.module('SmartReviseApp')
  .controller('SetupCtrl', function ($scope, $rootScope, $http, $location) {

    $rootScope.exams = []

    $scope.addExam = function() {
        // TODO: validate name first!
        $rootScope.exams.push({
            title: $scope.examName,
            date: ''
        });
        $scope.examName = '';
    };

    $scope.removeExam = function(index) {
        $rootScope.exams.splice(index,1);
    };

    $scope.hasDate = function(index) {
        if ($rootScope.exams[index].date == '') return true;
        return false;
    };

    $scope.invalid = function() {
        return $rootScope.exams.length ? false : true;
    }

    $scope.nextStep = function() {
        $location.path( 'view' );
    };
  });
