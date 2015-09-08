'use strict';

describe('Directive: socialMedia', function () {

  // load the directive's module and view
  beforeEach(module('meanApp'));
  beforeEach(module('app/social-media/social-media.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<social-media></social-media>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the socialMedia directive');
  }));
});