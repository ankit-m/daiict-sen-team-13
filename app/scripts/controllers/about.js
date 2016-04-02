(function() {
  'use strict';

/**
 * @ngdoc function
 * @name daiictSenTeam13App.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the daiictSenTeam13App
 */
angular.module('daiictSenTeam13App')
  .controller('AboutCtrl', ['$scope', function($scope)  {
    var ref = new Firebase('https://sfip.firebaseio.com/');
    var profileRef = new Firebase('https://sfip.firebaseio.com/abou );

      $scope.login = function() {
      $location.path('/');
      };

      $scope.SignUp = function(){
        $location.path('/register');
      };

    ];
  });
})();
