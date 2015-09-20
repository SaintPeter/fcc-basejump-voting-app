'use strict';

angular.module('meanApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/poll/:friendly', {
        templateUrl: 'app/poll/poll.html',
        controller: 'PollCtrl' 
      });
  });
