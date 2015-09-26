'use strict';

angular.module('meanApp')
  .controller('NavbarCtrl', function ($scope, $location, Auth, userAuthModals) {
    $scope.modals = userAuthModals;

    $scope.menu = [{
      'title': 'Home',
      'link': '/'
    }];

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.isAdmin = Auth.isAdmin;
    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.logout = function() {
      Auth.logout();
    };

    $scope.isActive = function(route) {
      return route === $location.path();
    };
  });
