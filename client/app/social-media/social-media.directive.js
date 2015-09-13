'use strict';

angular.module('meanApp')
  .directive('socialMedia', function () {
    return {
      templateUrl: 'app/social-media/social-media.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        scope.twitterURL = "http://twitter.com/intent/tweet?text=" + encodeURIComponent(attrs.text)
              + "&url=" + attrs.url;
        scope.facebookURL = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(attrs.url);
        scope.permalinkURL = attrs.url;
      }
    };
  });
