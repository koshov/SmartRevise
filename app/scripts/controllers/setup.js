'use strict';

angular.module('SmartReviseApp')
  .controller('SetupCtrl', function ($scope, $rootScope, $http, $location) {

    $rootScope.exams = locache.get('exams') || [];

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

    $scope.examInvalid = function() {
        function validName() {
            for (var i = 0; i < $rootScope.exams.length; i++) {
                if ($rootScope.exams[i].title === $scope.examName) return false;
            };
            return true;
        }

        if ($scope.examName !== undefined && $scope.examName !== '' && validName()) return false;
        return true;
    }

    $scope.setupInvalid = function() {
        function validDates() {
            for (var i = 0; i < $rootScope.exams.length; i++) {
                if ($rootScope.exams[i].date === '') return false;
            };
            return true;
        }

        if ($rootScope.exams.length && validDates()) return false;
        return true;
    }

    $scope.nextStep = function() {
        locache.set('exams', $rootScope.exams);
        $location.path( 'view' );
    };
  });
