'use strict';

angular.module('SmartReviseApp')
  .directive('fullclndr', function () {
    return {
      template: '<div id="calendar"></div>',
      restrict: 'E',
      replace: true,
      scope: {
        srExams: '=',
        srDate: '='
      },
      controller: function($scope, $attrs) {
        $scope.$on('SpecialEvent', function() {
            $('#calendar').fullCalendar( 'renderEvent', $scope.srExams[i]);
        });
      },
      link: function postLink(scope, element, attrs) {
        // Don't watch for fist exam dates if calendar initializes properly
        // scope.$watch('srDate', function() {createCalendar()});
        // var createCalendar = function() {
          $('#calendar').fullCalendar({
              header: {
                  left: 'prev,next today',
                  center: 'title',
                  right: 'month,agendaWeek'
              },
              defaultView: 'agendaWeek',
              month: scope.srDate.month(),
              date: scope.srDate.date(),
              firstDay: 1,  // Sets Monday to first day of week
              firstHour: 9,
              allDaySlot: false,
              contentHeight: 420
          });

          scope.$watch('srExams', function() {rerenderEvents()});
          var rerenderEvents = function() {
              $('#calendar').fullCalendar( 'removeEvents' )
              var examsLen = scope.srExams.length;
              for (var i = 0; i < examsLen; i++) {
                  $('#calendar').fullCalendar( 'renderEvent', scope.srExams[i], true);
              };
          };
        // }

      }
    };
  });
