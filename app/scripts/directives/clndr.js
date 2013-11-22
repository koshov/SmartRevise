'use strict';

angular.module('SmartReviseApp')
  .directive('clndr', function () {
    return {
      restrict: 'A',
      scope: false,
      link: function postLink(scope, element, attrs, parentCtrl) {

        var template = angular.element("#clndr-template").html();

        function create_calendar(jq_selector) {
          var result = angular.element('.'+jq_selector).clndr({
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
            element.val(date);
            scope.revisionStart = date;
        }

        var calendar_start = create_calendar(element[0].name);

        element.click(function(event) {
            calendar_start.calendarContainer.removeClass("calendar-hidden");
        });

      }
    };
  });
