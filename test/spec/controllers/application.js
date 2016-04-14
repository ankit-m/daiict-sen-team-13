'use strict';

describe('Controller: ApplicationCtrl', function() {

  // load the controller's module
  beforeEach(module('daiictSenTeam13App'));

  var ApplicationCtrl,
    scope,
    location,
    rootScope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, $location) {
    scope = $rootScope.$new();
    rootScope = $rootScope.$new();
    location = spyOn($location, 'path');
    ApplicationCtrl = $controller('ApplicationCtrl', {
      $scope: scope,
      $rootScope: rootScope
    });
  }));

  // it('should redirect to all home if user is of type faculty', function(){
  //   rootScope.userType = true;
  //   expect(location).toHaveBeenCalledWith('/faculty');
  // });

  it('should have no items to start', function() {
    expect(scope.letter.length).toBe(0);
    expect(scope.contactEmail.length).toBe(0);
  });

  it('should check for empty inputs', function() {
    scope.letter = '';
    scope.contactEmail = '';
    expect(scope.validate()).toBe(false);

    scope.letter = 'check';
    scope.contactEmail = '';
    expect(scope.validate()).toBe(false);

    scope.letter = '';
    scope.contactEmail = 'check';
    expect(scope.validate()).toBe(false);

    scope.letter = 'check';
    scope.contactEmail = 'check@daiict.ac.in';
    expect(scope.validate()).toBe(true);
  });

  it('should go to only student pages', function() {
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