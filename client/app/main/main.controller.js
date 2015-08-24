'use strict';

angular.module('meanApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth,$timeout, $routeParams) {
    $scope.isLoggedIn = Auth.isLoggedIn;

    var expanded = {};
    $scope.newPoll = { votes: [], options: [ { id: 0, text: ""} ]};

    $http.get('/api/polls').success(function(polls) {
      $scope.polls = polls; // .map(chartData);

      // Pre-populate a visilbity array
      expanded = polls.reduce(function(acc, item){
        acc[item._id] = false; return acc; },
        {} );

      socket.syncUpdates('poll', $scope.polls, function(event, item, array){
        // Handle visibility array
        switch(event) {
          case 'created':
            expanded[item._id] = false;
            break;
        }
      });
    });

    $scope.expanded = function(poll) {
      return expanded[poll.id];
    };

    $scope.toggleExpand = function(poll) {
      var temp = expanded[poll._id];
      Object.keys(expanded).forEach(function(item){expanded[item] = false;});
      expanded[poll._id] = !temp;
      // Force redraw
      window.dispatchEvent(new Event('resize'));
    };

    $scope.addPoll = function() {
      if($scope.newPoll.question === "" || $scope.newPoll.options.length === 1) {
        return;
      }
      $scope.newPoll.owner = Auth.getCurrentUser()._id;
      $scope.newPoll.owner_name = Auth.getCurrentUser().name;
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

    $scope.voted = function(poll) {
      if($routeParams.forceVote) {
        return false;
      }
      // If the client IP is not in the list of voters they have not voted
      return poll.voters.indexOf(clientIP) != -1;
    };

    $scope.doVote = function(poll, option) {
      $http.put('/api/polls/vote/' + poll._id, { voteFor: option.id });
    };

    $scope.pollOwner = function(poll) {
      return poll.owner === Auth.getCurrentUser()._id;
    }

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('poll');
    });
  });
