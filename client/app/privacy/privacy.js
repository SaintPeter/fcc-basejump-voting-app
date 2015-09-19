'use strict';

angular.module('meanApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/privacy', {
        templateUrl: 'app/privacy/privacy.html'
      });
  });
