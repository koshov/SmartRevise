'use strict';

angular.module('SmartReviseApp')
  .controller('ViewCtrl', function ($rootScope, $scope, $http) {
    // Populate scope
    $scope.dates = {}
    $scope.exams = []
    $scope.eventColors = [
        '#bedb39',
        '#004358',
        '#1f8a70',
        '#fd7400',
        '#ffe11a'
    ]

    $http.get('/api/dates')
        .success(function(dates) {
            $scope.dates = dates;

            $scope.dates.date = moment(dates.start).date();
            $scope.dates.month = moment(dates.start).month();
            $scope.dates.year = moment(dates.start).year();

            $scope.dates.dif = moment(dates.end).diff(moment(dates.start), 'days');

            // Load Exams after dates due to dependency on 'dif'
            $http.get('/api/exams')
                .success(function(exams) {
                    $scope.dates.portion = $scope.dates.dif / exams.length;
                    for (var i = exams.length - 1; i >= 0; i--) {
                        exams[i].portion = 100/exams.length;
                        exams[i].components = [
                            {name: 'Read Textbook', portion: 0.25},
                            {name: 'Solve Tutorials', portion: 0.25},
                            {name: 'Revise Lecture Notes', portion: 0.25},
                            {name: 'Attempt Past Papers', portion: 0.25}
                        ];
                        exams[i].start = new Date($scope.dates.year, $scope.dates.month, $scope.dates.date + i*$scope.dates.portion);
                        exams[i].end = new Date($scope.dates.year, $scope.dates.month, $scope.dates.date+$scope.dates.portion-1 + i*$scope.dates.portion);
                        exams[i].startNum = 0;
                        exams[i].len = $scope.dates.portion;
                        exams[i].color = $scope.eventColors[i % $scope.eventColors.length];
                    };
                    $scope.exams = exams;
                });
        });

    $scope.repartition = function(ind) {
        // Calculater portion reminders
        var newRemaining = 100 - $scope.exams[ind].portion;
        var oldRemaining = 0;
        for (var i = $scope.exams.length - 1; i >= 0; i--) {
            if (i != ind) {
                oldRemaining += $scope.exams[i].portion;
            }
        }

        // Loop through all exams and repartition
        var examsLen = $scope.exams.length;
        for (var i = 0; i < examsLen; i++) {
            if (i != ind) {
                if (oldRemaining > 0){
                    $scope.exams[i].portion = newRemaining * ($scope.exams[i].portion/oldRemaining);
                } else {
                    $scope.exams[i].portion = newRemaining / $scope.exams.length-1;
                }
            }

            // Update exam start and length
            $scope.exams[i].len = $scope.dates.dif * $scope.exams[i].portion / 100
            if (i != 0){
                $scope.exams[i].startNum = $scope.exams[i-1].startNum + $scope.exams[i-1].len;
            }
        }

        // Broadcast event to directive
        $rootScope.$broadcast('SpecialEvent');
    };

  });
