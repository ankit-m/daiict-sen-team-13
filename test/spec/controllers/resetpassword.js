'use strict';

describe('Controller: ResetpasswordCtrl', function () {

  // load the controller's module
  beforeEach(module('daiictSenTeam13App'));

  var ResetpasswordCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ResetpasswordCtrl = $controller('ResetpasswordCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
