(function() {
  'use strict';

  /**
   * @ngdoc controller
   * @name daiictSenTeam13App.controller:ResetpasswordCtrl
   * @description
   *
   * Controller for ResetpasswordCtrl and there is
   * something and also.
   */
  angular.module('daiictSenTeam13App')
    .controller('ResetpasswordCtrl', ['$scope', '$location', '$timeout', function($scope, $location, $timeout) {
      var ref = new Firebase('https://sfip.firebaseio.com/');

      $scope.oldPassword = '';
      $scope.newPassword = '';
      $scope.confirmNew = '';
      $scope.email = '';
      $location.url($location.path());

       $scope.validate = function() {
        if (!/([^\s])/.test($scope.email) || !/([^\s])/.test($scope.oldPassword) || !/([^\s])/.test($scope.newPassword) || !/([^\s])/.test($scope.confirmNew)) {
          Materialize.toast('All fields are required', 4000);
          return false;
        }
        console.log($scope.newPassword, $scope.confirmNew);
        if ($scope.newPassword !== $scope.confirmNew) {
          Materialize.toast('Passwords did not match', 4000);
          return false;
        }
        return true;
      };

      $scope.changePass = function() {
        if ($scope.validate()) {
          ref.changePassword({
            email: $scope.email,
            oldPassword: $scope.oldPassword,
            newPassword: $scope.newPassword
          }, function(error) {
            if (error) {
              switch (error.code) {
                case "INVALID_PASSWORD":
                  Materialize.toast("The specified user account password is incorrect.", 4000);
                  break;
                case "INVALID_USER":
                  Materialize.toast("The specified user account does not exist.", 4000);
                  break;
                default:
                  Materialize.toast("Error changing password:", 4000);
              }
            } else {
              Materialize.toast("User password changed successfully!", 4000);
              $location.path('/');
              $timeout(function() {
                $scope.$apply();
              });
            }
          });
        }
      };

    }]);
})();
