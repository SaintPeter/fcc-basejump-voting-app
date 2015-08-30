'use strict';

angular.module('meanApp')
  .controller('EditPollCtrl', function ($scope, thisPoll) {
    $scope.editPoll = thisPoll;
  });
