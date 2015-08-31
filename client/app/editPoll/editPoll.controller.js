'use strict';

angular.module('meanApp')
  .controller('EditPollCtrl', function ($scope, thisPoll) {
    $scope.editPoll = thisPoll;
    $scope.newOptions = [];

    $scope.addOption = function() {
      $scope.newOptions.push({
          id: $scope.editPoll.options.length + $scopt.newOptions.length,
          text: ""
       });
    };

    // Renumber options
    function renumberNewOptions() {
      // Start at the end of the current options
      var num = $scope.editPoll.options.length - 1;

      // Renumber all the new options
      $scope.newOptions = $scope.newOptions.map(function(option){
        option.id = num;
        num++;
        return option;
      });
    }

    $scope.deleteNewOption = function(del) {
      $scope.newOptions = $scope.newOptions.filter(function(option){
        return option.id !== del;
      });
      renumberOptions();
    };

    $scope.savePoll = function() {
      // Remove any blank answers:
      $scope.newOptions = $scope.newOptions.filter(function(option) {
        return option.text !== "";
      });

      // Clear out blank options
      renumberNewOptions();

      // Append newOptions to exiting poll
      $scope.editPoll.options.concat($scope.newOptions);

      // Create an array as long as the new options
      var newBlanks = Array.apply(null, Array($scope.newOptions.length)).map(Number.prototype.valueOf,0);

      // Append it to the current votes:
      $scope.editPoll.options = $scope.editPoll.options.concat(newBlanks);

      $http.put('/api/polls', $scope.editPoll);
    };

  });
