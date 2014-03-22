'use strict';

angular.module('SmartReviseApp')
  .directive('fullclndr', function () {
    return {
      template: '<div id="calendar"></div>',
      restrict: 'E',
      replace: true,
      scope: {
        srEvents: '=',
        srBlocking: '=',
        srDate: '=',
        srDaylen: '='
      },
      link: function postLink(scope, element, attrs) {

        // Create calendar after data has been fetched from server
        var created = false;
        scope.$watch('srDate', function() {
          if (!created) {
            created = true;
            createCalendar()
          }
        });

        function createCalendar() {
          // Show current time in timeline
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

          // Initialize calendar
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
                  scope.$apply(function() {
                    scope.srBlocking = {
                      type: "add",
                      blocking_event: {
                        title: title,
                        blocking: true,
                        portion: 0,
                        time: 0,
                        components: [],
                        date: moment(newStart),
                        duration: moment.duration(moment(newEnd).diff(moment(newStart), "minutes"), "minutes"),
                        duration_int: moment(newEnd).diff(moment(newStart), "minutes"),
                        start: moment(newStart).toDate(),
                        end: moment(newEnd).toDate()
                      }
                    }
                  });
                }
                $('#calendar').fullCalendar('unselect');
              },
              eventClick: function(calEvent, jsEvent, view) {
                if (calEvent.blocking) {
                  var dialog = confirm("Remove blocking event \"" + calEvent.title + "\"?");
                  if (dialog) {
                    $('#calendar').fullCalendar('removeEvents', [calEvent._id]);
                    scope.$apply(function() {
                      scope.srBlocking = {
                        type: "remove",
                        blocking_event: calEvent
                      }
                    });
                  }
                }
              },
              eventDrop: function(event, dayDelta, minuteDelta, allDay, revertFunc) {
                  scope.$apply(function() {
                    scope.srBlocking = {
                      type: "edit",
                      blocking_event: event
                    }
                  });
              },
              eventResize: function(event, dayDelta, minuteDelta, revertFunc) {
                  scope.$apply(function() {
                    scope.srBlocking = {
                      type: "edit",
                      blocking_event: event
                    }
                  });
              },
              editable: true,
              firstDay: 1,  // Sets Monday to first day of week
              firstHour: 8,
              allDaySlot: false
          });

          scope.$watch('srEvents', function() {rerenderEvents()});
          var rerenderEvents = function() {
              $('#calendar').fullCalendar('removeEvents');
              $('#calendar').fullCalendar('option', 'contentHeight', scope.srDaylen * 42 + 21);
              var eventsLen = scope.srEvents.length;
              for (var i = 0; i < eventsLen; i++) {
                  $('#calendar').fullCalendar('renderEvent', scope.srEvents[i], true);
              };
          };
        }
      }
    };
  });
