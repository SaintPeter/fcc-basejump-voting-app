'use strict';

describe('Controller: EditPollCtrl', function () {

  // load the controller's module
  beforeEach(module('meanApp'));

  var EditPollCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditPollCtrl = $controller('EditPollCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
