'use strict';

angular.module('SmartReviseApp')
  .directive('fullclndr', function () {
    return {
      template: '<div id="calendar"></div>',
      restrict: 'E',
      replace: true,
      scope: {
        srExams: '=',
        srBlocking: '=',
        srDate: '=',
        srDaylen: '='
      },
      controller: function($scope, $attrs) {
        $scope.$on('SpecialEvent', function() {
            $('#calendar').fullCalendar( 'renderEvent', $scope.srExams[i]);
        });
      },
      link: function postLink(scope, element, attrs) {
          // Show current time in timeline
          // http://stackoverflow.com/questions/8813454/fullcalendar-current-time-line-on-week-view-and-day-view
          function setTimeline(view) {
              var parentDiv = jQuery(".fc-agenda-slots:visible").parent();
              var timeline = parentDiv.children(".timeline");
              if (timeline.length == 0) { //if timeline isn't there, add it
                  timeline = jQuery("<hr>").addClass("timeline");
                  parentDiv.prepend(timeline);
              }

              var curTime = new Date();

              var curCalView = jQuery("#calendar").fullCalendar('getView');
              if (curCalView.visStart < curTime && curCalView.visEnd > curTime) {
                  timeline.show();
              } else {
                  timeline.hide();
                  return;
              }

              var curSeconds = (curTime.getHours() * 60 * 60) + (curTime.getMinutes() * 60) + curTime.getSeconds();
              var percentOfDay = curSeconds / 86400; //24 * 60 * 60 = 86400, # of seconds in a day
              var topLoc = Math.floor(parentDiv.height() * percentOfDay);

              timeline.css("top", topLoc + "px");

              if (curCalView.name == "agendaWeek") { //week view, don't want the timeline to go the whole way across
                  var dayCol = jQuery(".fc-today:visible");
                  var left = dayCol.position().left + 1;
                  var width = dayCol.width()-2;
                  timeline.css({
                      left: left + "px",
                      width: width + "px"
                  });
              }
          }

          $('#calendar').fullCalendar({
              header: {
                  left: 'prev,next today',
                  center: 'title',
                  right: 'month,agendaWeek'
              },
              viewDisplay: function(view) {
                  try {
                      setTimeline();
                  } catch(err) {}
              },
              defaultView: 'agendaWeek',
              month: scope.srDate.month(),
              date: scope.srDate.date(),
              selectable: true,
              selectHelper: true,
              select: function(newStart, newEnd, allDay) {
                var title = prompt('Event Title:');
                if (title) {
                  // $('#calendar').fullCalendar('renderEvent',
                  //   {
                  //     title: title,
                  //     start: newStart,
                  //     end: newEnd,
                  //     allDay: allDay
                  //   },
                  //   true // make the event "stick"
                  // );
                  scope.srBlocking = {
                    title: title,
                    blocking: true,
                    portion: 0,
                    time: 0,
                    components: [],
                    date: moment(newStart),
                    duration: moment.duration(moment(newEnd).diff(moment(newStart), "minutes"), "minutes"),
                    start: moment(newStart).toDate(),
                    end: moment(newEnd).toDate(),
                    allDay: false,
                    color: "#dddddd"
                  };
                  scope.$apply();
                }
                $('#calendar').fullCalendar('unselect');
              },
              editable: true,
              firstDay: 1,  // Sets Monday to first day of week
              firstHour: 8,
              allDaySlot: false
          });

          scope.$watch('srExams', function() {rerenderEvents()});
          var rerenderEvents = function() {
              $('#calendar').fullCalendar( 'removeEvents' );
              $('#calendar').fullCalendar('option', 'contentHeight', scope.srDaylen * 42 + 21);
              var examsLen = scope.srExams.length;
              for (var i = 0; i < examsLen; i++) {
                  $('#calendar').fullCalendar( 'renderEvent', scope.srExams[i], true);
              };
          };

      }
    };
  });
