'use strict';

describe('Controller: ViewjobCtrl', function () {

  // load the controller's module
  beforeEach(module('daiictSenTeam13App'));

  var ViewjobCtrl,
    rootScope,
    location,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $location) {
    scope = $rootScope.$new();
    rootScope = $rootScope.$new();
    location = spyOn($location, 'path');

    ViewjobCtrl = $controller('ViewjobCtrl', {
      $scope: scope,
      $rootScope: rootScope
      // place here mocked dependencies
    });
  }));

  it('should go to all faculty pages only', function(){
    scope.goTo('profile');
    expect(location).toHaveBeenCalledWith('/profile');

    scope.goTo('people');
    expect(location).toHaveBeenCalledWith('/people');

    scope.goTo('home');
    expect(location).toHaveBeenCalledWith('/faculty');

    scope.goTo('chatRooms');
    expect(location).toHaveBeenCalledWith('/createChat');

    scope.goTo('jobs');
    expect(location).toHaveBeenCalledWith('/posting');
  });

  
});
