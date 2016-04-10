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
      var self = this;

      $rootScope.userType = null;
      $scope.loading = true;
      $scope.loading = false;
      $scope.email = '';
      $scope.password = '';

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
        var userRef = new Firebase('https://sfip.firebaseio.com/users');
        var authData = ref.getAuth();
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
       * Redirects user to reset password page.
       * @returns {undefined} Does not return anything.
       */
      self.goToReset = function(){
        $location.path('/resetPassword');
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
