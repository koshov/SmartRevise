'use strict';

describe('Service: Userdata', function () {

  // load the service's module
  beforeEach(module('smartReviseApp'));

  // instantiate service
  var Userdata;
  beforeEach(inject(function (_Userdata_) {
    Userdata = _Userdata_;
  }));

  it('should do something', function () {
    expect(!!Userdata).toBe(true);
  });

});
