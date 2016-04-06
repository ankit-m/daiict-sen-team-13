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
    .controller('RegisterCtrl', ['$scope', '$location', function($scope, $location) {
      var ref = new Firebase('https://sfip.firebaseio.com/');

      $scope.email = '';
      $scope.firstName = '';
      $scope.lastName = '';
      $scope.password = 'pass';
      $scope.userType = 'student';

      function resetValues() {
        $scope.email = '';
        $scope.firstName = '';
        $scope.lastName = '';
        $scope.password = 'pass';
        $scope.userType = 'student';
      }
      resetValues();

      function sendPassword(email) {
        ref.resetPassword({
          email: email
        }, function(error) {
          if (error) {
            switch (error.code) {
              case "INVALID_USER":
                console.log("The specified user account does not exist.");
                break;
              default:
                console.log("Error resetting password:", error);
            }
          } else {
            console.log("Password reset email sent successfully!");
          }
        });
      }

      $scope.signup = function() {
        console.log('signup called');
        if ($scope.email.indexOf('daiict.ac.in') < 0) { //verifications add
          console.error('Invalid email. Use DAIICT email');
          resetValues();
        } else {
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

              var profileData = {};

              // var instituteKey = ref.child('institutions').push().key();
              // profileData['/institutions/' + instituteKey] = {
              //   id: 'daiict',
              //   name: 'Dhirubhai Ambani Institute of Information and Communication Technology',
              //   location: 'Gandhinagar',
              //   country: 'India',
              //   createOn: Firebase.ServerValue.TIMESTAMP
              // };

              var userKey = ref.child('users').push().key();
              profileData['/users/' + userKey] = {
                email: $scope.email,
                firstName: $scope.firstName,
                lastName: $scope.lastName,
                type: $scope.userType,
                activated: false
              };

              var profileKey = ref.child('profile').push().key();
              profileData['/profile/' + profileKey] = {
                email: $scope.email,
                firstName: $scope.firstName,
                lastName: $scope.lastName,
                type: $scope.userType
              };

              console.log(profileData);

              ref.update(profileData, function(error) {
                if (error) {
                  console.error('Cannot create profile');
                  //remove user
                } else {
                  console.log('created profile');
                  $location.path('/');
                  Materialize.toast('Password sent to the email.', 4000);
                  $scope.$apply();
                }
              });

              sendPassword($scope.email);
            }
          });
        }
        console.log('signup return');
      };
    }]);
})();
