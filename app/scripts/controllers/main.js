(function() {
  'use strict';

  /**
   * @ngdoc controller
   * @name daiictSenTeam13App.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('MainCtrl', ['$scope', '$location', '$timeout', '$rootScope', function($scope, $location, $timeout, $rootScope) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();
      var self = this;
      $rootScope.userType = null;

      $scope.loading = true;

      function redirectUser() {
        var userRef = new Firebase('https://sfip.firebaseio.com/users');
        var authData = ref.getAuth();

        //cache data!!
        userRef.orderByChild('email').equalTo(authData.password.email).once('value', function(snapshot) {
          var userObject = snapshot.val();
          for (var key in userObject) {
            if (userObject[key].type === 'professor') {
              $rootScope.userType = true;
              $location.path('/faculty');
              $scope.$apply();
            } else if (userObject[key].type === 'student') {
              $rootScope.userType = false;
              $location.path('/student');
              $scope.$apply();
            }
            break;
          }
        });
      }

      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
        redirectUser();
      }

      $scope.loading = false;

      $scope.email = '';
      $scope.password = '';
      //  = submit; /*Self and this function used before definition*/

      $scope.goToRegister = function() {
        $location.path('/register');
      };

      self.goToReset = function(){
        $location.path('/resetPassword');
      };

      self.login = function() {
        $scope.loading = true;
        $timeout(function() {
          $scope.$apply();
        });
        ref.authWithPassword({
          "email": $scope.email,
          "password": $scope.password
        }, function(error, authData) {
          if (error) {
            $scope.password = '';
            $timeout(function() {
              $scope.$apply();
            });
            $scope.loading = false;
            Materialize.toast(error, 4000);
          } else {
            console.log("Authenticated successfully with payload:", authData);
            if (authData.password.isTemporaryPassword) {
              $scope.loading = false;
              $location.path('/resetPassword');
              $timeout(function() {
                $scope.$apply();
              });
            } else {
              redirectUser();
            }
          }
        });
      };
    }]);
})();
