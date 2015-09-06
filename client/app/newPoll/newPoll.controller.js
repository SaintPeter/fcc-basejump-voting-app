'use strict';

angular.module('meanApp')
  .controller('NewPollCtrl', function ($scope, $http, Auth) {
    $scope.newPoll = { votes: [], options: [ { id: 0, text: ""} ]};

    $scope.close = function(result) {
     	close(result, 500); // close, but give 500ms for bootstrap to animate
     };

    $scope.addPoll = function() {
      if($scope.newPoll.question === "" || $scope.newPoll.options.length === 1) {
        return;
      }
      $scope.newPoll.owner = Auth.getCurrentUser()._id;
      $scope.newPoll.owner_name = Auth.getCurrentUser().name;
      $scope.newPoll.created = new Date();
      $scope.newPoll.totalVotes = 0;

      // Remove any blank answers:
      $scope.newPoll.options = $scope.newPoll.options.filter(function(option) {
        return option.text !== "";
      });

      renumberOptions();

      $http.post('/api/polls', $scope.newPoll);
    };

    // Renumber options, zero out votes:
    function renumberOptions() {
      var num = 0;
      $scope.newPoll.votes = [];
      $scope.newPoll.options = $scope.newPoll.options.map(function(option){
        option.id = num;
        num++;
        $scope.newPoll.votes[option.id] = 0;
        return option;
      });
    }

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
      renumberOptions();
    };

  });
