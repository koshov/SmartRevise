'use strict';

angular.module('SmartReviseApp')
  .controller('ViewCtrl', function ($rootScope, $scope, $resource, $location, Auth) {
    function runAlgorithm(exams, revisionStart) {
        var algoResult = algo(exams,
                              // Random dates since we only use the times
                              moment("01/01/01 " + $scope.times.start),
                              moment("01/01/01 " + $scope.times.end),
                              revisionStart);
        $scope.calendarEvents = algoResult.events;
        $scope.firstDay = algoResult.firstDay;
    };

    $scope.blocking = undefined;
    $scope.$watch('blocking', function(){
        if ($scope.blocking) {
            if ($scope.blocking.type == "add") {
                $scope.exams.push($scope.blocking.blocking_event);
            } else {
                for (var i = 0; i < $scope.exams.length; i++) {
                    if ($scope.exams[i].date.format() == moment($scope.blocking.blocking_event.start).format()
                        && $scope.exams[i].title == $scope.blocking.blocking_event.title) {
                        $scope.exams.splice(i,1);
                        console.log($scope.exams[i]);
                        break;
                    }
                };
            }

            locache.set('exams', $scope.exams);

            if ($rootScope.currentUser) {

                var user = $resource('/api/users/data/:id', {
                                      id: '@id'
                                    }, { //parameters default
                                      update: {
                                        method: 'POST',
                                        params: {}
                                      }
                                    });

                var pr = function(callback) {
                            var cb = callback || angular.noop;

                            return user.update({
                              data: $scope.exams
                            }, function(user) {
                              return cb(user);
                            }, function(err) {
                              return cb(err);
                            }).$promise;
                        };

                pr().then(function() {
                    console.log("Yes");
                });

            };

            runAlgorithm($scope.exams);
        }
    }, false);

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


    if (locache.get('exams')) {
        $scope.exams = locache.get('exams');
        for (var i = $scope.exams.length - 1; i >= 0; i--) {
            $scope.exams[i].date = moment($scope.exams[i].date);
            $scope.exams[i].duration = moment.duration($scope.exams[i].duration_int, "minutes");
        }
        runAlgorithm($scope.exams);
    } else {
        $location.path( 'setup' );
    };

    $scope.newComponent = "";
    $scope.subtaskDeadline = function(exam, component) {
        if (!$scope.exams[exam].blocking) {
            var subtaskDeadline = $scope.exams[exam].components[component].deadline;
            if (moment().diff(subtaskDeadline) > 0) return true;
        }
        return false
    }
    $scope.addComponent = function(ind) {
        if ($scope.newComponent !== "") {
            $scope.exams[ind].components.push(
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
        $scope.exams[exam].components.splice(component, 1);
        runAlgorithm($scope.exams, $scope.revisionStart);
    }


    $scope.repartition = function(title) {
        // Calculate portion reminders
        var exams = $scope.exams;
        var ind = -1;
        for (var i = 0; i < exams.length; i++) {
            if (exams[i].title == title) {
                ind = i;
                break;
            }
        };
        console.log(exams[ind]);
        var newRemaining = 100 - exams[ind].portion;
        var oldRemaining = 0;
        for (var i = exams.length - 1; i >= 0; i--) {
            if (i != ind && !exams[i].blocking) {
                oldRemaining += exams[i].portion;
            };
        };

        // Loop through all exams and repartition
        var examsLen = exams.length;
        for (var i = 0; i < examsLen; i++) {
            if (i != ind && !exams[i].blocking) {
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
    $rootScope.$on("settingsToggled", function(event, args) {
        $scope.settingsToggle = !args.settings;
    });

  });
