'use strict';

angular.module('SmartReviseApp')
  .controller('ViewCtrl', function ($rootScope, $scope, $http) {
    // Populate scope
    $scope.eventColors = [
        '#ffe11a',
        '#bedb39',
        '#004358',
        '#1f8a70',
        '#fd7400'
    ];

    if ($rootScope.exams === undefined) {
        if (locache.get('exams')) {
            $rootScope.exams = locache.get('exams');
        } else {
            $location.path( 'setup' );
        }
    }
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

    var algoResult = algo(exams);
    $scope.calendarEvents = algoResult.events;
    $scope.firstDay = algoResult.firstDay;



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
        var algoResult = algo(exams);
        $scope.calendarEvents = algoResult.events;
        $scope.firstDay = algoResult.firstDay;

    };

  });
