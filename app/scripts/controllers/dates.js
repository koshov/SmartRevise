'use strict';

angular.module('SmartReviseApp')
  .controller('DatesCtrl', function ($scope, $http) {
        var template = $("#clndr-template").html();
        function create_calendar(jq_selector) {
          var result = $(jq_selector).clndr({
            _name: 'kur',
            template: template,
            weekOffset: 1,
            adjacentDaysChangeMonth: true,
            clickEvents: {
              click: function(target){
                toggle_calendar(this, jq_selector, target.date._i);
              }
            }
          });
            result.calendarContainer.addClass("calendar-hidden");
            return result
        };
        function toggle_calendar(calendar, name, date) {
            calendar.calendarContainer.addClass("calendar-hidden");
            if (name == '.clndr-holder-start'){
              $('input[name=clndr-start]').val(date);
          } else if (name == '.clndr-holder-end'){
              $('input[name=clndr-end]').val(date);
          }
        }

        var calendar_start = create_calendar('.clndr-holder-start');
        var calendar_end = create_calendar('.clndr-holder-end');

        $('input[name=clndr-start]').click(function(event) {
            calendar_start.calendarContainer.removeClass("calendar-hidden");
        });
        $('input[name=clndr-end]').click(function(event) {
            calendar_end.calendarContainer.removeClass("calendar-hidden");
        });
  });
