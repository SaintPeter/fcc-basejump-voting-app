'use strict';

angular.module('meanApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/:forceVote', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      });
  });
