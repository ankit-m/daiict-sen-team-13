'use strict';

describe('Controller: CreatechatCtrl', function () {

  // load the controller's module
  beforeEach(module('daiictSenTeam13App'));

  var CreatechatCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CreatechatCtrl = $controller('CreatechatCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CreatechatCtrl.awesomeThings.length).toBe(3);
  });
});
