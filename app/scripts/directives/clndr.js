'use strict';

angular.module('SmartReviseApp')
  .directive('clndr', function () {
    return {
      restrict: 'A',
      replace: false,
      link: function postLink(scope, element, attrs, parentCtrl) {


        var template = angular.element("#clndr-template").html();

        function create_calendar(jq_selector) {
          var result = angular.element('.'+jq_selector).clndr({
            template: template,
            weekOffset: 1,
            startWithMonth: moment(),
            adjacentDaysChangeMonth: true,
            events: [{date: moment()}],
            clickEvents: {
              click: function(target){
                if( !$(target.element).hasClass('inactive')
                    && !$(target.element).hasClass('next-month')
                    && !$(target.element).hasClass('last-month')) {
                  toggle_calendar(this, jq_selector, target.date._i);
                }
              }
            },
            constraints: {
              startDate: moment().subtract('days', 1)
            }
          });
            result.calendarContainer.addClass("calendar-hidden");
            return result
        };

        function toggle_calendar(calendar, name, date) {
            calendar.calendarContainer.addClass("calendar-hidden");
            element.val(moment(date).format('L'));
            // Trigger input event in order to update ng-model
            element.trigger('input');
        }

        var calendar_start = create_calendar(element[0].name);

        element.click(function(event) {
            calendar_start.calendarContainer.removeClass("calendar-hidden");
        });
      }
    };
  });
