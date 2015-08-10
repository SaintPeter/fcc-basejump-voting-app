'use strict';

angular.module('meanApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/pollAdd', {
        templateUrl: 'app/pollAdd/pollAdd.html',
        controller: 'PollAddCtrl',
        authenticate: true
      });
  });