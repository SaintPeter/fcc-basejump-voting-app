'use strict';

describe('Service: pollFunctions', function () {

  // load the service's module
  beforeEach(module('meanApp'));

  // instantiate service
  var pollFunctions;
  beforeEach(inject(function (_pollFunctions_) {
    pollFunctions = _pollFunctions_;
  }));

  it('should do something', function () {
    expect(!!pollFunctions).toBe(true);
  });

});
