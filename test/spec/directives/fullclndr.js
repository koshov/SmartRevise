'use strict';

describe('Directive: fullclndr', function () {

  // load the directive's module
  beforeEach(module('smartReviseApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<fullclndr></fullclndr>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the fullclndr directive');
  }));
});
