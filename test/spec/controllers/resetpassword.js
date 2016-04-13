'use strict';

describe('Controller: ResetpasswordCtrl', function () {

  // load the controller's module
  beforeEach(module('daiictSenTeam13App'));

  var ResetpasswordCtrl,
    rootScope,
    location,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $location) {
    scope = $rootScope.$new();
    rootScope = $rootScope.$new();
    location = spyOn($location, 'path');
    ResetpasswordCtrl = $controller('ResetpasswordCtrl', {
      $scope: scope,
      $rootScope: rootScope
      // place here mocked dependencies
    });
  }));

  // it('should validate password', function(){

  //   scope.oldPassword="";
  //   scope.newPassword="newpass";
  //   expect(scope.validate()).toBe(false);


  //   scope.oldPassword="oldpass";
  //   scope.newPassword="";


  // });
});
