'use strict';

describe('Controller: ChatroomsCtrl', function () {

  // load the controller's module
  beforeEach(module('daiictSenTeam13App'));

  var ChatroomsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChatroomsCtrl = $controller('ChatroomsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ChatroomsCtrl.awesomeThings.length).toBe(3);
  });
});
