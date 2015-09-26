'use strict';

angular.module('meanApp')
  .service('userAuthModals', ['ModalService', function (ModalService) {
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

    // Display login modal
    thisService.doLogin = function() {
      this.doShowModal({
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      }, function(result) {
        if(result === 'signup') {
          this.doSignup();
        }
      });
    };

    // Display Signup Modal
    thisService.doSignup = function() {
      this.doShowModal({
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      }, function(result) {
        if(result === 'login') {
          this.doLogin();
        }
      });
    };
    return thisService;
  }]);
