(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name daiictSenTeam13App.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('MainCtrl', ['$scope', function($scope) {
      var ref = new Firebase('https://sfip.firebaseio.com/');

      $scope.email = '';
      $scope.password = '';
      //  = submit; /*Self and this function used before definition*/

      $scope.submit = function() {
        console.log('submit form');
        ref.createUser({
          email: $scope.email,
          password: $scope.password
        }, function(error, userData) {
          if (error) {
            console.log("Error creating user:", error);
          } else {
            console.log("Successfully created user account with uid:", userData.uid);
          }
        });
      };
    }]);
})();
