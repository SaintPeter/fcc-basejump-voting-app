'use strict';

angular.module('meanApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth,$timeout, $routeParams, userAuthModals, pollFunctions) {
    var expanded = {};
    $scope.pf = pollFunctions;
    $scope.modal = userAuthModals;
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.myPolls = false;

    // Function Assignments
    $scope.toggleExpand = toggleExpand;
    $scope.isExpanded = isExpanded;

    // $scope.addPoll =  $scope.pf.addPoll;
    // $scope.doEditPoll =  $scope.pf.doEditPoll;
    // $scope.doVote =  $scope.pf.doVote;
    // $scope.clearPoll =  $scope.pf.clearPoll;
    // $scope.deletePoll =  $scope.pf.deletePoll;
    // $scope.pollOwner =  $scope.pf.pollOwner;
    // $scope.voted =  $scope.pf.voted;
    // $scope.editPoll =  $scope.pf.editPoll;

    // Initial Poll Load
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

    function isExpanded(poll) {
      return expanded[poll.id];
    };

    function toggleExpand(poll) {
      var temp = expanded[poll._id];
      Object.keys(expanded).forEach(function(item){expanded[item] = false;});
      expanded[poll._id] = !temp;
      poll.updated = false;
      // Force redraw
      window.dispatchEvent(new Event('resize'));
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('poll');
    });
  });
