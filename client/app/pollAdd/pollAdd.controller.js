'use strict';

angular.module('meanApp')
  .controller('PollAddCtrl', function ($scope, $http, socket, Auth) {
    $scope.newPoll = { votes: [], options: [ { id: 0, text: ""} ]};

    $http.get('/api/polls').success(function(polls) {
      $scope.polls = polls;
      socket.syncUpdates('poll', $scope.polls);
    });

    $scope.addPoll = function() {
      if($scope.newPoll.question === "" || $scope.newPoll.options.length === 1) {
        return;
      }
      $scope.newPoll.owner = Auth.getCurrentUser().name;
      $scope.newPoll.created = new Date();

      // Remove any blank answers:
      $scope.newPoll.options = $scope.newPoll.options.filter(function(option) {
        return option.text !== "";
      });

      // Renumber options, zero out votes:
      var num = 0;
      $scope.newPoll.options = $scope.newPoll.options.map(function(option){
        option.id = num;
        num++;
        $scope.newPoll.votes[option.id] = 0;
        return option;
      });

      $http.post('/api/polls', $scope.newPoll);
      $scope.newPoll = { votes: [], options: [ { id: 0, text: ""} ]};
    };

    $scope.addOption = function() {
      $scope.newPoll.options.push({
          id: $scope.newPoll.options.length,
          text: ""
       });
    };

    $scope.deleteOption = function(del) {
      $scope.newPoll.options = $scope.newPoll.options.filter(function(option){
        return option.id !== del;
      });
    };

    $scope.deletePoll = function(poll) {
      $http.delete('/api/polls/' + poll._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('poll');
    });


  });
