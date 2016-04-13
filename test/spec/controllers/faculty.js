'use strict';

describe('Controller: FacultyCtrl', function () {

  // load the controller's module
  beforeEach(module('daiictSenTeam13App'));

  var FacultyCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FacultyCtrl = $controller('FacultyCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
