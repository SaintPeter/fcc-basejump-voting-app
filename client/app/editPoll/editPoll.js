'use strict';

angular.module('meanApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/editPoll', {
        templateUrl: 'app/editPoll/editPoll.html',
        controller: 'EditPollCtrl'
      });
  });
