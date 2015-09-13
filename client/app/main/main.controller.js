'use strict';

angular.module('meanApp')
  .controller('MainCtrl', function ($scope, $http, socket, Auth,$timeout, $routeParams, ModalService) {
    var expanded = {};
    $scope.isLoggedIn = Auth.isLoggedIn;
    $scope.myPolls = false;

    // Function Assignments
    $scope.addPoll = addPoll;
    $scope.doEditPoll = doEditPoll;
    $scope.toggleExpand = toggleExpand;
    $scope.isExpanded = isExpanded;

    $scope.doVote = doVote;
    $scope.clearPoll = clearPoll;
    $scope.deletePoll = deletePoll;
    $scope.pollOwner = pollOwner;
    $scope.voted = voted;
    $scope.editPoll = editPoll;

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

    function doShowModal(controllerObj) {
      ModalService.showModal(controllerObj)
        .then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {
        });
      }).catch(function(error) {
          // error contains a detailed error message.
          console.log("Error:", error);
      });
    }

    // Display the Modal Dialog for the new Poll interface
    function addPoll() {
      doShowModal({
        templateUrl: "/app/newPoll/newPoll.html",
        controller: "NewPollCtrl"
      });
    };

    // Display the modal dialog for the edit poll interface
    function doEditPoll(poll) {
      doShowModal({
        templateUrl: "/app/editPoll/editPoll.html",
        controller: "EditPollCtrl",
        inputs: {
          thisPoll: poll
        }
      });
    };



    function isExpanded(poll) {
      return expanded[poll.id];
    };

    function toggleExpand(poll) {
      var temp = expanded[poll._id];
      Object.keys(expanded).forEach(function(item){expanded[item] = false;});
      expanded[poll._id] = !temp;
      // Force redraw
      window.dispatchEvent(new Event('resize'));
    };

    function deletePoll(poll) {
      $http.delete('/api/polls/' + poll._id);
    };

    function editPoll(poll) {

    }

    function voted(poll) {
      if($routeParams.forceVote) {
        return false;
      }
      // If the client IP is not in the list of voters they have not voted
      return poll.voters.indexOf(clientIP) != -1;
    };

    function doVote(poll, option) {
      $http.put('/api/polls/vote/' + poll._id, { voteFor: option.id });
    };

    function clearPoll(poll) {
      $http.get('/api/polls/clear/' + poll._id);
    };

    function pollOwner(poll) {
      return poll.owner === Auth.getCurrentUser()._id;
    }

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('poll');
    });
  });
