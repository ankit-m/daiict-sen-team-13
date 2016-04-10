'use strict';

describe('Controller: JobsCtrl', function () {

  // load the controller's module
  beforeEach(module('daiictSenTeam13App'));

  var JobsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JobsCtrl = $controller('JobsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

});
