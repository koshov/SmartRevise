'use strict';

angular.module('SmartReviseApp')
  .directive('fullclndr', function () {
    return {
      template: '<div id="calendar"></div>',
      restrict: 'E',
      replace: true,
      scope: {
        srExams: '=',
        srDates: '=',
        srRepart: '='
      },
      controller: function($scope, $attrs) {
        $scope.$on('SpecialEvent', function() {
            var examsLen = $scope.srExams.length;
            for (var i = 0; i < examsLen; i++) {
                $scope.srExams[i].start = new Date($scope.srDates.year, $scope.srDates.month, $scope.srDates.date + $scope.srExams[i].startNum, 9);
                $scope.srExams[i].end = new Date($scope.srDates.year, $scope.srDates.month, $scope.srDates.date + $scope.srExams[i].len-1 + $scope.srExams[i].startNum, 18);
                // console.log($sco¡pe.srExams[i]);
                $('#calendar').fullCalendar( 'renderEvent', $scope.srExams[i]);

            };
        });
      },
      link: function postLink(scope, element, attrs) {
        var rerenderClndr = function() {
            if (scope.srDates.portion) {
                $('#calendar').fullCalendar({
                    header: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'month,agendaWeek,agendaDay'
                    },
                    month: scope.srDates.month
                    // editable: true,
                });
            }
        };

        var rerenderEvents = function() {
            var examsLen = scope.srExams.length;
            for (var i = 0; i < examsLen; i++) {
                $('#calendar').fullCalendar( 'renderEvent', scope.srExams[i], true);
            };
        };

        scope.$watch('srDates', function() {rerenderClndr()}, true);
        scope.$watch('srExams', function() {rerenderEvents()});
      }
    };
  });
