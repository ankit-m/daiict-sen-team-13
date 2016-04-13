'use strict';

describe('Controller: ViewprofileCtrl', function () {

  // load the controller's module
  beforeEach(module('daiictSenTeam13App', 'firebase'));

  var ViewprofileCtrl,
    rootScope,
    location,
    fireSync,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $location, $firebase) {
    scope = $rootScope.$new();
    rootScope = $rootScope.$new();
    location = spyOn($location, 'path');
    fireSync = $firebase(new Firebase('https://sfip.firebaseio.com'));
    ViewprofileCtrl = $controller('ViewprofileCtrl', {
      $scope: scope,
      $rootScope: rootScope
      // place here mocked dependencies
    });
  }));

  // it('should get correct profile data', function(){
    
  // });

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
