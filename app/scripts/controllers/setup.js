'use strict';

angular.module('SmartReviseApp')
  .controller('SetupCtrl', function ($scope, $rootScope, $http, $location) {

    // $scope.exams = locache.get('exams') || [];
    $scope.exams = [];

    $scope.addExam = function() {
        // TODO: validate name first!
        $scope.exams.push({
            title: $scope.examName,
            date: ''
        });
        $scope.examName = '';
    };

    $scope.removeExam = function(index) {
        $scope.exams.splice(index,1);
    };

    $scope.hasDate = function(index) {
        if ($scope.exams[index].date == '') return true;
        return false;
    };

    $scope.examInvalid = function() {
        function validName() {
            for (var i = 0; i < $scope.exams.length; i++) {
                if ($scope.exams[i].title === $scope.examName) return false;
            };
            return true;
        }

        if ($scope.examName !== undefined && $scope.examName !== '' && validName()) return false;
        return true;
    }

    $scope.setupInvalid = function() {
        function validDates() {
            for (var i = 0; i < $scope.exams.length; i++) {
                if ($scope.exams[i].date === '') return false;
            };
            return true;
        }

        if ($scope.exams.length && validDates()) return false;
        return true;
    }

    $scope.nextStep = function() {
        var exams = $scope.exams;
        var eventColors = [
            '#ffe11a',
            '#bedb39',
            '#004358',
            '#1f8a70',
            '#fd7400'
        ];
        for (var i = exams.length - 1; i >= 0; i--) {
            exams[i].portion = 100/exams.length;
            exams[i].components = [
                {name: 'Read Textbook', portion: 0.25, done: false},
                {name: 'Solve Tutorials', portion: 0.25, done: false},
                {name: 'Revise Lecture Notes', portion: 0.25, done: false},
                {name: 'Attempt Past Papers', portion: 0.25, done: false}
            ];
            exams[i].color = eventColors[i % eventColors.length];
            exams[i].allDay = false;
            exams[i].blocking = false;
            exams[i].duration_int = 120;
        };
        locache.set('exams', exams);
        $location.path( 'view' );
    };
  });
