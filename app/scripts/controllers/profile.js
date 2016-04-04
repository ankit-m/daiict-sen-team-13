(function() {
  'use strict';
  /**
   * @ngdoc function
   * @name daiictSenTeam13App.controller:ProfileCtrl
   * @description
   * # ProfileCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('ProfileCtrl', ['$scope', '$location', '$timeout', function($scope, $location, $timeout) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();
      var self = this;

      $scope.loading = true;

      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }

      function getData(){
        ref.child('postings').orderByChild('email').equalTo(authData.password.email).on('value', function(dataSnapshot) {
          if(dataSnapshot.val() === null){
            // resetValues();
          } else {

          }
          $scope.loading = false;
          $timeout(function() {
            $scope.$apply();
          });
          $scope.loading=false;
        }, function(err) {
          console.error(err);
        });
      }
      getData();

      $scope.initMaterial = function() {
        $(document).ready(function() {
          $(".button-collapse").sideNav();
          $('select').material_select();
        });
      };
      $scope.initMaterial();

      self.logout = function() {
        console.log('logout called');
        ref.unauth();
        console.log('logged out');
        $location.path('/');
      };


         $scope.goTo = function(page) {
        switch (page) {
          case 'profile':
            $location.path('/profile');
            break;
          case 'chatRooms':
            if(authData.password.email.charAt(4)==="1"){
               $location.path('/createChat');
            }
            else {
              $location.path('/chatRooms');
            }
            
            break;
          case 'jobs':
            if(authData.password.email.charAt(4)==="1"){
               $location.path('/posting');
            }
            else {
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
      

    }]);
})();
