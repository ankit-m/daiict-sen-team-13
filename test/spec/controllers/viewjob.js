'use strict';

describe('Controller: ViewjobCtrl', function () {

  // load the controller's module
  beforeEach(module('daiictSenTeam13App'));

  var ViewjobCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ViewjobCtrl = $controller('ViewjobCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
