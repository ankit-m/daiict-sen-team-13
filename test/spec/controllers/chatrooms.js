'use strict';

describe('Controller: ChatroomsCtrl', function () {

  // load the controller's module
  beforeEach(module('daiictSenTeam13App'));

  var ChatroomsCtrl,
    scope,
    rootScope,
    location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $location) {
    scope = $rootScope.$new();
    rootScope = $rootScope.$new();
    location = spyOn($location, 'path');
    ChatroomsCtrl = $controller('ChatroomsCtrl', {
      $scope: scope,
      $rootScope: rootScope
      // place here mocked dependencies
    });
  }));

  it('should initialize all values', function() {
    expect(scope.chatHistory.length).toBe(0);
    expect(scope.members.length).toBe(0);
    expect(scope.userEmail.length).toBe(0);
  });

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

  // it('should validate joining chatRoom', function(){
  //
  // });

});