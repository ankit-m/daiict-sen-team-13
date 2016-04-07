'use strict';

describe('Controller: ViewprofileCtrl', function () {

  // load the controller's module
  beforeEach(module('daiictSenTeam13App'));

  var ViewprofileCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewprofileCtrl = $controller('ViewprofileCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ViewprofileCtrl.awesomeThings.length).toBe(3);
  });
});