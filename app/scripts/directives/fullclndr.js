'use strict';

angular.module('SmartReviseApp')
  .directive('fullclndr', function () {
    return {
      template: '<div id="calendar"></div>',
      restrict: 'E',
      replace: true,
      scope: {
        srExams: '=',
        srRepart: '='
      },
      controller: function($scope, $attrs) {
        $scope.$on('SpecialEvent', function() {
            $('#calendar').fullCalendar( 'renderEvent', $scope.srExams[i]);
        });
      },
      link: function postLink(scope, element, attrs) {
          $('#calendar').fullCalendar({
              header: {
                  left: 'prev,next today',
                  center: 'title',
                  right: 'month,agendaWeek,agendaDay'
              },
              month: moment().month(),
              firstDay: 1,
              firstHour: 9
              // editable: true,
          });

          var rerenderEvents = function() {
              var examsLen = scope.srExams.length;
              for (var i = 0; i < examsLen; i++) {
                  $('#calendar').fullCalendar( 'renderEvent', scope.srExams[i], true);
              };
          };

          scope.$watch('srExams', function() {rerenderEvents()});
      }
    };
  });
