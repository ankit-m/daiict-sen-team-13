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

  it('should attach a list of awesomeThings to the scope', function () {
    expect(PostingCtrl.awesomeThings.length).toBe(3);
  });
});
