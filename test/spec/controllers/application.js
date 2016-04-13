'use strict';

describe('Controller: ApplicationCtrl', function() {

  // load the controller's module
  beforeEach(module('daiictSenTeam13App'));

  var ApplicationCtrl,
    scope,
    location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($controller, $rootScope, $location) {
    scope = $rootScope.$new();
    location = spyOn($location, 'path');
    ApplicationCtrl = $controller('ApplicationCtrl', {
      $scope: scope
    });
  }));

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

  it('should go to correct page', function() {
    scope.goTo('profile');
    expect(location).toHaveBeenCalledWith('/profile');
    
    scope.goTo('people');
    expect(location).toHaveBeenCalledWith('/people');
  });


});
