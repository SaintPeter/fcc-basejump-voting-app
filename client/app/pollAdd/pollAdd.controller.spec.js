'use strict';

describe('Controller: PollAddCtrl', function () {

  // load the controller's module
  beforeEach(module('meanApp'));

  var PollAddCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PollAddCtrl = $controller('PollAddCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
