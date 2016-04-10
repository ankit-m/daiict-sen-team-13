(function() {
  'use strict';

  /**
   * @ngdoc controller
   * @name daiictSenTeam13App.controller:RegisterCtrl
   * @description
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('RegisterCtrl', ['$scope', '$location', '$timeout', function($scope, $location, $timeout) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var self = this;
      var password = 'pass';

      function resetValues() {
        $scope.email = '';
        $scope.firstName = '';
        $scope.lastName = '';
        $scope.userType = 'student';
        $scope.institute = '';
      }
      resetValues();

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:RegisterCtrl#sendPassword
       * @methodOf daiictSenTeam13App.controller:RegisterCtrl
       * @param {string} email Email address with which the user registered.
       * @description
       * Sends an email to reset the passworf for given email address. In case
       * of an error, raises appropriate toasts.
       * @returns {undefined} Does not return anything.
       */
      function sendPassword(email) {
        ref.resetPassword({
          email: email
        }, function(error) {
          if (error) {
            switch (error.code) {
              case "INVALID_USER":
                Materialize.toast("The specified user account does not exist.", 4000);
                break;
              default:
                Materialize.toast("Error resetting password:" + error, 4000);
            }
          }
        });
      }

      function validate() {
        if ($scope.email.indexOf('@daiict.ac.in') < 0) { //verifications add
          Materialize.toast('Please use DAIICT email address.', 4000);
          resetValues();
          return false;
        }
        console.log(!/([^\s*])/.test($scope.firstName));
        if (!/([^\s])/.test($scope.firstName) || !/([^\s])/.test($scope.lastName) || !/([^\s])/.test($scope.institute)) {
          Materialize.toast('All fields are required.', 4000);
          return false;
        } else {
          $scope.email = $scope.email.trim();
          $scope.firstName = $scope.firstName.trim();
          $scope.lastName = $scope.lastName.trim();
          $scope.institute = $scope.institute.trim();
          $timeout(function() {
            $scope.$apply();
          });
          return true;
        }
      }

      self.signup = function() {
        if (validate()) {
          $scope.loading = true;
          ref.createUser({
            email: $scope.email,
            password: password
          }, function(error, userData) {
            if (error) {
              switch (error.code) {
                case "EMAIL_TAKEN":
                  Materialize.toast("The new user account cannot be created because the email is already in use.", 4000);
                  break;
                case "INVALID_EMAIL":
                  Materialize.toast("The specified email is not a valid email.", 4000);
                  break;
                default:
                  Materialize.toast("Error creating user. Try again later", 4000);
                  $location.path('/');
                  $timeout(function() {
                    $scope.$apply();
                  });
              }
            } else {
              var profileData = {};

              var instituteKey = ref.child('institutions').push().key();
              profileData['/institutions/' + instituteKey] = {
                id: 'daiict',
                name: 'Dhirubhai Ambani Institute of Information and Communication Technology',
                createOn: Firebase.ServerValue.TIMESTAMP
              };

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

              ref.update(profileData, function(error) {
                if (error) {
                  Materialize.toast('Cannot create profile', 4000);
                  //TODO remove user
                } else {
                  console.log('created profile');
                  $scope.loading = false;
                  $location.path('/');
                  Materialize.toast('Password sent to the email.', 4000);
                  $timeout(function() {
                    $scope.$apply();
                  });
                }
              });
              sendPassword($scope.email);
            }
          });
        }
      };
    }]);
})();
