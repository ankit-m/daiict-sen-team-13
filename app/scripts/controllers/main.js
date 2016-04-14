(function() {
  'use strict';

  /**
   * @ngdoc controller
   * @name daiictSenTeam13App.controller:MainCtrl
   * @description
   * Controller for the route `/`. It checks authenticates the user
   * and redirects to the appropriate page.
   */
  angular.module('daiictSenTeam13App')
    .controller('MainCtrl', ['$scope', '$location', '$timeout', '$rootScope', function($scope, $location, $timeout, $rootScope) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();

      $rootScope.userType = null;
      $scope.loading = true;
      $timeout(function() {
        $scope.$apply();
      });
      $scope.loading = false;
      $scope.email = '';
      $scope.password = '';
      $location.url($location.path());

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:MainCtrl#redirectUser
       * @methodOf daiictSenTeam13App.controller:MainCtrl
       * @description
       * Fetches the authentication data from local storage of the browser.
       * Identifies the type of user i.e. faculty or student by making an API
       * call to `/users`. Also sets attaches `userType` variable to `$rootScope`.
       * @returns {undefined} Does not return anything.
       */
      function redirectUser() {
        $scope.loading = true;
        $timeout(function() {
          $scope.$apply();
        });
        var userRef = new Firebase('https://sfip.firebaseio.com/users');
        var authData = ref.getAuth();
        userRef.orderByChild('email').equalTo(authData.password.email).once('value', function(snapshot) {
          var userObject = snapshot.val();
          for (var key in userObject) {
            if (userObject[key].type === 'professor') {
              sessionStorage.setItem('userType', 'true');
              $location.path('/faculty');
              $timeout(function() {
                $scope.$apply();
              });
            } else if (userObject[key].type === 'student') {
              sessionStorage.setItem('userType', 'false');
              $location.path('/student');
              $timeout(function() {
                $scope.$apply();
              });
            }
            break;
          }
        });
      }

      if (authData) {
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

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:MainCtrl#validate
       * @methodOf daiictSenTeam13App.controller:MainCtrl
       * @description
       * Validates user input on main page.
       * @returns {undefined} Does not return anything.
       */
      $scope.validate = function() {
        if (!$scope.email) {
          Materialize.toast('Enter a valid email', 4000);
          $scope.password = '';
          return false;
        }
        if (!/([^\s])/.test($scope.email) || !/([^\s])/.test($scope.password)) {
          Materialize.toast('All fields are required', 4000);
          return false;
        }
        return true;
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:MainCtrl#initMaterial
       * @methodOf daiictSenTeam13App.controller:MainCtrl
       * @description
       * Initializes Materialize components.
       * @returns {undefined} Does not return anything.
       */
      $scope.initMaterial = function() {
        $(document).ready(function() {
          $('.modal-trigger').leanModal();
        });
      };
      $scope.initMaterial();

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:MainCtrl#goToRegister
       * @methodOf daiictSenTeam13App.controller:MainCtrl
       * @description
       * Redirects user to registration page.
       * @returns {undefined} Does not return anything.
       */
      $scope.goToRegister = function() {
        $location.path('/register');
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:MainCtrl#goToReset
       * @methodOf daiictSenTeam13App.controller:MainCtrl
       * @description
       * Sends the password to user's email.
       * @returns {undefined} Does not return anything.
       */
      $scope.resetPassword = function() {
        ref.resetPassword({
          email: $scope.email
        }, function(error) {
          if (error) {
            switch (error.code) {
              case "INVALID_USER":
                Materialize.toast("The specified user account does not exist.", 4000);
                break;
              default:
                Materialize.toast("Error resetting password:" + error, 4000);
            }
          } else {
            Materialize.toast('New password sent.', 4000);
          }
        });
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:MainCtrl#login
       * @methodOf daiictSenTeam13App.controller:MainCtrl
       * @description
       * Gets the email and password from scope. Makes a login request to Firebase.
       * If successful, checks for temporary password or calls `redirectUser`.
       * In case of login error, raises appropriate toats.
       * @returns {undefined} Does not return anything.
       */
      $scope.login = function() {
        if ($scope.validate()) {
          $scope.loading = true;
          ref.authWithPassword({
            "email": $scope.email.toString(),
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
        }
      };
    }]);
})();
