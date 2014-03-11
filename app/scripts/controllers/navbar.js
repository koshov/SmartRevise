'use strict';

angular.module('SmartReviseApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth) {
    $scope.settingsToggled  = false;
    $scope.settingsToggle = function() {
      $scope.settingsToggled = !$scope.settingsToggled;
      $scope.$emit("settingsToggled", {"settings": $scope.settingsToggled});
    }

    $scope.expandTopbar = function() {
      if ($('nav.top-bar').hasClass('expanded')) {
        $('nav.top-bar').removeClass('expanded');
      } else {
        $('nav.top-bar').addClass('expanded');
      }
    }

    $scope.logout = function() {
      Auth.logout()
      .then(function() {
        $location.path('/login');
      });
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
