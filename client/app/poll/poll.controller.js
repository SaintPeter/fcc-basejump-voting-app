'use strict';

angular.module('meanApp')
  .controller('PollCtrl', function ($scope, socket, Auth, $http, $routeParams, ModalService) {
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

      // Function Assignments
      $scope.doEditPoll = doEditPoll;

      $scope.doVote = doVote;
      $scope.clearPoll = clearPoll;
      $scope.deletePoll = deletePoll;
      $scope.pollOwner = pollOwner;
      $scope.voted = voted;

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

      // Display the modal dialog for the edit poll interface
      function doEditPoll(poll) {
        doShowModal({
          templateUrl: "app/editPoll/editPoll.html",
          controller: "EditPollCtrl",
          inputs: {
            thisPoll: poll
          }
        });
      };

      function deletePoll(poll) {
        $http.delete('/api/polls/' + poll._id);
        // TODO:  Redirect after delete
      };

      function voted(poll) {
        if($routeParams.forceVote) {
          return false;
        }
        if(poll) {
          // If the client IP is not in the list of voters they have not voted
          return poll.voters.indexOf(clientIP) != -1;
        } else {
          return false;
        }
      };

      function doVote(poll, option) {
        $http.put('/api/polls/vote/' + poll._id, { voteFor: option.id });
      };

      function clearPoll(poll) {
        $http.get('/api/polls/clear/' + poll._id);
      };

      function pollOwner(poll) {
        return (poll.owner === Auth.getCurrentUser()._id) || Auth.getCurrentUser().role === 'admin';
      }

      $scope.$on('$destroy', function () {
        socket.unsyncUpdates('poll');
      });


  });
