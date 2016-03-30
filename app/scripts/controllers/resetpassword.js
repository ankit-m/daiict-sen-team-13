(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name daiictSenTeam13App.controller:ResetpasswordCtrl
   * @description
   * # ResetpasswordCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('ResetpasswordCtrl', ['$scope', '$location', function($scope, $location) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();
      var email = '';

      if (authData) {
        email = authData.password.email;
        console.log('User logged in with email: ', email);
      } else {
        $location.path('/login');
      }

      function resetValues() {
        $scope.oldPassword = '';
        $scope.newPassword = '';
        $scope.confirmNew = '';
      }
      resetValues();

      //TODO verify passwords
      $scope.changePass = function() {
        console.log('changePass called');
        ref.changePassword({
          email: email,
          oldPassword: $scope.oldPassword,
          newPassword: $scope.newPassword
        }, function(error) {
          if (error) {
            switch (error.code) {
              case "INVALID_PASSWORD":
                console.log("The specified user account password is incorrect.");
                break;
              case "INVALID_USER":
                console.log("The specified user account does not exist.");
                break;
              default:
                console.log("Error changing password:", error);
            }
          } else {
            console.log("User password changed successfully!");
            $location.path('/');
          }
        });
      };

    }]);
})();
