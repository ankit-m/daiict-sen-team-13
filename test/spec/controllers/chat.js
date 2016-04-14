'use strict';

describe('Controller: ChatCtrl', function () {

  // load the controller's module
  beforeEach(module('daiictSenTeam13App'));

  var ChatCtrl,
    scope,
    rootScope,
    location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $location) {
    scope = $rootScope.$new();
    rootScope = $rootScope.$new();
    location = spyOn($location, 'path');

    ChatCtrl = $controller('ChatCtrl', {
      $scope: scope,
      $rootScope: rootScope
      // place here mocked dependencies
    });
  }));

    it('should redirect to correct pages', function() {
    scope.goTo('profile');
    expect(location).toHaveBeenCalledWith('/profile');

    scope.goTo('people');
    expect(location).toHaveBeenCalledWith('/people');

    rootScope.userType = false;
    scope.goTo('home');
    expect(location).toHaveBeenCalledWith('/student');

    scope.goTo('chatRooms');
    expect(location).toHaveBeenCalledWith('/chatRooms');

    scope.goTo('jobs');
    expect(location).toHaveBeenCalledWith('/jobs');

    rootScope.userType = true;
    scope.goTo('home');
    expect(location).toHaveBeenCalledWith('/faculty');

    scope.goTo('chatRooms');
    expect(location).toHaveBeenCalledWith('/createChat');

    scope.goTo('jobs');
    expect(location).toHaveBeenCalledWith('/posting');
  });

});


