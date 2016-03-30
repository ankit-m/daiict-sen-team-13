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

      function redirectUser() {
        var userRef = new Firebase('https://sfip.firebaseio.com/users');
        //cache data!!
        userRef.orderByChild('email').equalTo(authData.password.email).once('value', function(snapshot) {
          var userObject = snapshot.val();
          for (var key in userObject) {
            if (userObject[key].type === 'professor') {
              $location.path('/faculty');
              $scope.$apply();
            } else if (userObject[key].type === 'student') {
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
        // $location.path('/profile');
      }

      $scope.email = '';
      $scope.password = '';
      //  = submit; /*Self and this function used before definition*/

      $scope.goToRegister = function() {
        $location.path('/register');
      };

      $scope.login = function() {
        console.log('login called');
        ref.authWithPassword({
          "email": $scope.email,
          "password": $scope.password
        }, function(error, authData) {
          if (error) {
            $scope.password = '';
            $scope.$apply();
            console.log("Login Failed!", error);
          } else {
            console.log("Authenticated successfully with payload:", authData);
            if (authData.password.isTemporaryPassword) {
              $location.path('/resetPassword');
              $scope.$apply();
            } else {
              redirectUser();
            }
          }
        });
        console.log('login return');
      };
    }]);
})();
