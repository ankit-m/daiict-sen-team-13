'use strict';

describe('Controller: StudentCtrl', function () {

  // load the controller's module
  beforeEach(module('daiictSenTeam13App'));

  var StudentCtrl,
    scope,
    location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $location) {
    scope = $rootScope.$new();
    location = spyOn($location, 'path');
    FacultyCtrl = $controller('StudentCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should go to all student pages only', function(){
    scope.goTo('profile');
    expect(location).toHaveBeenCalledWith('/profile');

    scope.goTo('people');
    expect(location).toHaveBeenCalledWith('/people');

    scope.goTo('home');
    expect(location).toHaveBeenCalledWith('/student');

    scope.goTo('chatRooms');
    expect(location).toHaveBeenCalledWith('/chatRooms');

    scope.goTo('jobs');
    expect(location).toHaveBeenCalledWith('/jobs');
  });


  
});