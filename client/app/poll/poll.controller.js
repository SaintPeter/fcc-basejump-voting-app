'use strict';

angular.module('meanApp')
  .controller('PollCtrl', function ($scope, socket, Auth, $http, $routeParams, ModalService, pollFunctions) {
    $scope.pf = pollFunctions;
    $scope.ready = false;
    $scope.polls = [];
    // Load needed data
    $http.get('/api/polls/friendly/' + $routeParams.friendly)
      .then(function(response) {
        // Success
        $scope.polls.push(response.data);
        $scope.ready = true;

        socket.syncUpdates('poll', $scope.polls, function(event, item, array){
        });
      }, function(response) {
        // Error
        console.log(response);
      });

      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('poll');
      });


  });
