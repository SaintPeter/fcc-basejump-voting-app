'use strict';

angular.module('meanApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window, $cookieStore, close) {
    $scope.user = {};
    $scope.errors = {};

    $scope.close = function(result) {
     	close(result, 500); // close, but give 500ms for bootstrap to animate
     };

    $scope.login = {
      submit: function(form) {
        $scope.submitted = true;

        if(form.$valid) {
          Auth.login({
            email: $scope.user.email,
            password: $scope.user.password
          })
          .then( function() {
              close('done',500);
          })
          .catch( function(err) {
            $scope.errors.other = err.message;
          });
        }
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
