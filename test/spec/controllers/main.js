'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('daiictSenTeam13App'));

  var MainCtrl,
    scope,
    rootScope,
    location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $location) {
    scope = $rootScope.$new();
    rootScope = $rootScope.$new();
    location = spyOn($location, 'path');
    MainCtrl = $controller('MainCtrl', {
      $scope: scope,
      $rootScope: rootScope
      // place here mocked dependencies
    });
  }));

  it('should validate email address', function(){
    scope.email = "201301128@daiict.ac.in";
    expect(scope.validate()).toBe(true);
  
    scope.email = "201301128@nnn";
    expect(scope.validate()).toBe(false);

    scope.email = "";
    expect(scope.validate()).toBe(false);
    
  });

  it('should go to register', function(){
    scope.goToRegister();
    expect(location).toHaveBeenCalledWith('/register');
  });

});
