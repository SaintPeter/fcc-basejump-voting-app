'use strict';

angular.module('meanApp')
  .controller('EditPollCtrl', function ($scope, thisPoll, $http, close) {
    // Create a clone/copy of the poll we're editing
    $scope.editPoll = JSON.parse(JSON.stringify(thisPoll));
    $scope.message = '';

    $scope.addOption = function() {
      $scope.editPoll.options.push({
          id: $scope.editPoll.options.length,
          text: ""
       });
       // Add a new blank vote
       $scope.editPoll.votes.push(0);
    };

    // Renumber options
    function renumberOptions() {
      var num = 0;

      // Renumber all the new options
      $scope.editPoll.options = $scope.editPoll.options.map(function(option){
        option.id = num;
        num++;
        return option;
      });
    }

    $scope.deleteOption = function(del) {
      // Remove the option from the poll
      $scope.editPoll.options = $scope.editPoll.options.filter(function(option){
        return option.id !== del;
      });
      // Delete corasponding votes
      $scope.editPoll.votes.splice(del,1);
      renumberOptions();
    };

    $scope.savePoll = function() {
      // Remove any blank answers
      $scope.editPoll.options.forEach(function(option) {
        if(option.text.trim().length < 1) {
          $scope.deleteOption(option.id);
        }
      });

      if($scope.editPoll.options.length < 2) {
        $scope.message = "You must have at least two options.";
        return;
      } else {
        $scope.message = '';
      }

      $http.put('/api/polls/' + $scope.editPoll._id, $scope.editPoll);
      close('done');
    };

  });
