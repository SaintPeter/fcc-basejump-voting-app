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
        scope.googleURL = "https://plus.google.com/share?url=" + encodeURIComponent(attrs.url);
        //console.log('attr:', JSON.stringify(attrs, null, 2));
        if(attrs.hasOwnProperty('permalink')) {
          scope.permalinkURL = attrs.url;
        }
      }
    };
  });
