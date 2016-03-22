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
    .controller('MainCtrl', ['$scope', '$location', function($scope, $location) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();

      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
        $location.path('/profile');
      }

      $scope.email = '';
      $scope.password = '';
      //  = submit; /*Self and this function used before definition*/

      $scope.login = function() {
        console.log('login called');
        ref.authWithPassword({
          "email": $scope.email,
          "password": $scope.password
        }, function(error, authData) {
          if (error) {
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
            $location.path('/profile');
            $scope.$apply();
          }
        });
        console.log('login return');
      };
    }]);
})();
