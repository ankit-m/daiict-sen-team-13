(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name daiictSenTeam13App.controller:RegisterCtrl
   * @description
   * # RegisterCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('RegisterCtrl', ['$scope', function($scope) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var profileRef = new Firebase('https://sfip.firebaseio.com/profile');

      $scope.email = '';
      $scope.firstName = '';
      $scope.lastName = '';
      $scope.password = '';
      $scope.userType = 'student';
      
      //  = submit; /*Self and this function used before definition*/

      // function sendPassword(email) {
      //   ref.resetPassword({
      //     email: email
      //   }, function(error) {
      //     if (error) {
      //       switch (error.code) {
      //         case "INVALID_USER":
      //           console.log("The specified user account does not exist.");
      //           break;
      //         default:
      //           console.log("Error resetting password:", error);
      //       }
      //     } else {
      //       console.log("Password reset email sent successfully!");
      //     }
      //   });
      // }

      $scope.signup = function() {
        console.log('signup called');
        ref.createUser({
          email: $scope.email,
          password: $scope.password
        }, function(error, userData) {
          if (error) {
            switch (error.code) {
              case "EMAIL_TAKEN":
                console.log("The new user account cannot be created because the email is already in use.");
                break;
              case "INVALID_EMAIL":
                console.log("The specified email is not a valid email.");
                break;
              default:
                console.log("Error creating user:", error);
            }
          } else {
            console.log("Successfully created user account with uid:", userData.uid);
            $scope.myFirstName = $scope.firstName;
            profileRef.push({
              "firstName": $scope.firstName,
              "lastName": $scope.lastName,
              "email": $scope.email,
              "userType": $scope.userType
            });




            //var tempRef = new Firebase("https://sfip.firebaseio.com/chatRooms/" + path + "/members");




          }
        });
        console.log('signup return');
      };
    }]);
})();
