'use strict';

describe('Controller: PostingCtrl', function () {

  // load the controller's module
  beforeEach(module('daiictSenTeam13App'));

  var PostingCtrl,
    scope,
    location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $location) {
    scope = $rootScope.$new();
    location = spyOn($location, 'path');
    PostingCtrl = $controller('PostingCtrl', {
      $scope: scope
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
