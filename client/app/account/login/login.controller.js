'use strict';

angular.module('meanApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, $window, $cookieStore) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          if (typeof $cookieStore.get('returnUrl') != 'undefined' && $cookieStore.get('returnUrl') != '') {
            $location.path($cookieStore.get('returnUrl'));
            $cookieStore.remove('returnUrl');
          }
          else
          {
            $location.path('/');
          }
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };
  });
