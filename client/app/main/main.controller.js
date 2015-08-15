'use strict';

angular.module('meanApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth) {
    $scope.isLoggedIn = Auth.isLoggedIn;

      $http.get('/api/polls').success(function(polls) {
      $scope.polls = polls;
      socket.syncUpdates('poll', $scope.polls);
    });
  });
