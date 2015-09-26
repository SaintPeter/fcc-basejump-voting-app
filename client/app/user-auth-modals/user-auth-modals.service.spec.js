'use strict';

describe('Service: userAuthModals', function () {

  // load the service's module
  beforeEach(module('meanApp'));

  // instantiate service
  var userAuthModals;
  beforeEach(inject(function (_userAuthModals_) {
    userAuthModals = _userAuthModals_;
  }));

  it('should do something', function () {
    expect(!!userAuthModals).toBe(true);
  });

});
