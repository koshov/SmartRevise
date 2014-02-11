'use strict';

angular.module('SmartReviseApp')
  .controller('ViewCtrl', function ($rootScope, $scope, $http) {
    function runAlgorithm(exams, revisionStart) {
        var algoResult = algo(exams,
                              moment("01/01/12 " + $scope.times.start),
                              moment("01/01/12 " + $scope.times.end),
                              revisionStart);
        $scope.calendarEvents = algoResult.events;
        $scope.firstDay = algoResult.firstDay;
    };

    // Populate scope
    $scope.eventColors = [
        '#ffe11a',
        '#bedb39',
        '#004358',
        '#1f8a70',
        '#fd7400'
    ];

    // Day start & end times
    $scope.selectTimes = ["0:00", "0:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30", "5:00", "5:30", "6:00", "6:30", "7:00", "7:30", "8:00", "8:30", "9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00", "23:30"]
    $scope.times = {
        start: "9:00",
        end: "18:00"
    };
    $scope.dayLen = 11;
    $scope.$watch('times', function(){
        if ($scope.exams) runAlgorithm($scope.exams);
        $scope.dayLen = moment("01/01/12 " + $scope.times.end).diff(moment("01/01/12 " + $scope.times.start), 'hours') + 2;
    }, true);

    // Revision start date
    $scope.revisionStart = "";
    $scope.$watch('revisionStart', function() {
        if ($scope.exams) runAlgorithm($scope.exams, $scope.revisionStart);
    }, true);


    if ($rootScope.exams === undefined) {
        if (locache.get('exams')) {
            $rootScope.exams = locache.get('exams');
        } else {
            $location.path( 'setup' );
        };
    };
    var exams = $rootScope.exams;
    for (var i = exams.length - 1; i >= 0; i--) {
        exams[i].date = moment(exams[i].date);
        exams[i].portion = 100/exams.length;
        exams[i].components = [
            {name: 'Read Textbook', portion: 0.25, done: false},
            {name: 'Solve Tutorials', portion: 0.25, done: false},
            {name: 'Revise Lecture Notes', portion: 0.25, done: false},
            {name: 'Attempt Past Papers', portion: 0.25, done: false}
        ];
        exams[i].duration = moment.duration(2, "hours");
        exams[i].color = $scope.eventColors[i % $scope.eventColors.length];
        exams[i].allDay = false;
    };
    runAlgorithm(exams);

    $scope.newComponent = "";
    $scope.subtaskDeadline = function(exam, component) {
        var subtaskDeadline = $scope.exams[exam].components[component].deadline;
        if (moment().diff(subtaskDeadline) > 0) return true;
        return false
    }
    $scope.addComponent = function(ind) {
        if ($scope.newComponent !== "") {
            $rootScope.exams[ind].components.push(
                {
                    name: $scope.newComponent,
                    portion: 0,
                    done: false
                }
            );
            $scope.newComponent = "";
            runAlgorithm($scope.exams, $scope.revisionStart);
        }
    };
    $scope.deleteComponent = function(exam, component) {
        $rootScope.exams[exam].components.splice(component, 1);
        runAlgorithm($scope.exams, $scope.revisionStart);
    }


    $scope.repartition = function(ind) {
        // Calculater portion reminders
        var exams = $scope.exams;
        var newRemaining = 100 - exams[ind].portion;
        var oldRemaining = 0;
        for (var i = exams.length - 1; i >= 0; i--) {
            if (i != ind) {
                oldRemaining += exams[i].portion;
            };
        };

        // Loop through all exams and repartition
        var examsLen = exams.length;
        for (var i = 0; i < examsLen; i++) {
            if (i != ind) {
                if (oldRemaining > 0){
                    exams[i].portion = newRemaining * (exams[i].portion/oldRemaining);
                } else {
                    exams[i].portion = newRemaining / exams.length-1;
                };
            };
        };
        runAlgorithm(exams);

    };



    // ==== Interface ====
    $scope.settingsToggle = true;

  });
