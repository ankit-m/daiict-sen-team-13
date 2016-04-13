'use strict';

describe('Controller: PostingCtrl', function () {

  // load the controller's module
  beforeEach(module('daiictSenTeam13App'));

  var PostingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    PostingCtrl = $controller('PostingCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));
});
