(function() {
  'use strict';
  /**
   * @ngdoc function
   * @name daiictSenTeam13App.controller:ViewprofileCtrl
   * @description
   * # ViewprofileCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('ViewprofileCtrl', ['$scope', '$location', '$timeout', '$routeParams', function($scope, $location, $timeout, $routeParams) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();
      var email = $routeParams.profileId;
      var self = this;

      $scope.loading = true;

      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }

      function getData() {
        ref.child('profile').orderByChild('email').equalTo(email).once('value', function(dataSnapshot) {
          console.log(dataSnapshot.val());
          var temp = dataSnapshot.val();
          for (var key in temp) {
            $scope.firstName = temp[key].firstName;
            $scope.lastName = temp[key].lastName;
            $scope.type = temp[key].type;
            $scope.institute = temp[key].institute;
            $scope.about = temp[key].about;
            $scope.interests = temp[key].interests;
            $scope.publications = temp[key].publications;
            break;
          }
          $timeout(function() {
            $scope.$apply();
          });
          $scope.loading = false;
        }, function(err) {
          console.error(err);
        });
      }
      getData();

      $scope.initMaterial = function() {
        $(document).ready(function() {
          $(".button-collapse").sideNav();
        });
      };
      $scope.initMaterial();

      self.logout = function() {
        console.log('logout called');
        ref.unauth();
        console.log('logged out');
        $location.path('/');
      };

    }]);
})();
