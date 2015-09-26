'use strict';

angular.module('meanApp')
  .service('pollFunctions', ['ModalService', 'Auth', '$routeParams', '$http', function (ModalService, Auth, $routeParams, $http) {
    var thisService = {};

    thisService.doShowModal = function(controllerObj, callback) {
      ModalService.showModal(controllerObj)
        .then(function(modal) {
          modal.element.modal();
          modal.close.then(function(result) {
            $('.modal-backdrop').remove();
            if(typeof callback === 'function') {
              callback(result);
            }
        });
      }).catch(function(error) {
          // error contains a detailed error message.
          console.log("Error:", error);
      });
    };

    // Display the Modal Dialog for the new Poll interface
    thisService.addPoll = function() {
      this.doShowModal({
        templateUrl: "app/newPoll/newPoll.html",
        controller: "NewPollCtrl"
      });
    };

    // Display the modal dialog for the edit poll interface
    thisService.doEditPoll = function(poll) {
      this.doShowModal({
        templateUrl: "app/editPoll/editPoll.html",
        controller: "EditPollCtrl",
        inputs: {
          thisPoll: poll
        }
      });
    };

    thisService.deletePoll = function(poll) {
      $http.delete('/api/polls/' + poll._id);
    };

    thisService.voted = function(poll) {
      if($routeParams.forceVote === 'forceVote') {
        return false;
      }
      // If the client IP is not in the list of voters they have not voted
      return poll.voters.indexOf(clientIP) != -1;
    };

    thisService.doVote = function(poll, option) {
      $http.put('/api/polls/vote/' + poll._id, { voteFor: option.id });
    };

    thisService.clearPoll = function(poll) {
      $http.get('/api/polls/clear/' + poll._id);
    };

    thisService.pollOwner = function(poll) {
      return (poll.owner === Auth.getCurrentUser()._id) || Auth.getCurrentUser().role === 'admin';
    };

    return thisService;
  }]);
