'use strict';

describe('Directive: clndr', function () {

  // load the directive's module
  beforeEach(module('smartReviseApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<clndr></clndr>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the clndr directive');
  }));
});
