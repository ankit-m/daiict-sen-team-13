(function() {
  'use strict';
  //TODO: date UTC format
  /**
   * @ngdoc function
   * @name daiictSenTeam13App.controller:PeopleCtrl
   * @description
   * # PeopleCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('PeopleCtrl', ['$scope', '$location', '$timeout', function($scope, $location, $timeout) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();
      var self = this;

      $scope.jobs = {};
      $scope.loading = true;

      $scope.goTo = function(page) {
        switch (page) {
          case 'profile':
            $location.path('/profile');
            break;
          case 'chatRooms':
            if (authData.password.email.charAt(4) === "1") {
              $location.path('/createChat');
            } else {
              $location.path('/chatRooms');
            }

            break;
          case 'jobs':
            if (authData.password.email.charAt(4) === "1") {
              $location.path('/posting');
            } else {
              $location.path('/jobs');
            }
            break;
          case 'people':
            $location.path('/people');
            break;
          default:
            $location.path('/');
        }
      };

      function getData() {
        ref.child('profile').once('value', function(dataSnapshot) {
          $scope.people = dataSnapshot.val();
          console.log($scope.people);
          $scope.loading = false;
          $timeout(function() {
            $scope.$apply();
          });
        }, function(err) {
          if (err) {
            Materialize.toast('Could Not obtain Data', 4000);
            $location.path('/');
          }
        });
      }
      getData();

      self.viewProfile = function() {
        console.log('view Profile');
      };

    }]);
})();
