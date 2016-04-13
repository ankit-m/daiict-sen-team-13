'use strict';

describe('Controller: PeopleCtrl', function () {

  // load the controller's module
  beforeEach(module('daiictSenTeam13App'));

  var PeopleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PeopleCtrl = $controller('PeopleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
