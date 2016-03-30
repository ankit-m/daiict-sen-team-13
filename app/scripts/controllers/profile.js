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
    .controller('ProfileCtrl', ['$scope', '$location', function($scope, $location) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var profileRef = new Firebase('https://sfip.firebaseio.com/profile/');
      var authData = ref.getAuth();
      $scope.myFirstName="";
      $scope.myLastName="";
      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }

      $scope.initMaterial = function() {
        $(document).ready(function() {
          $(".button-collapse").sideNav();
          $('select').material_select();
        });
      };
      $scope.initMaterial();

      $scope.logout = function() {
        console.log('logout called');
        ref.unauth();
        console.log('logged out');
        $location.path('/');
      };




      profileRef.once("value", function(allProfilesSnapshot) {
        allProfilesSnapshot.forEach(function(profileSnapshot) {
          // Will be called with a messageSnapshot for each child under the /messages/ node
          //var key = profileSnapshot.key(); // e.g. "-JqpIO567aKezufthrn8"
          //console.log("hello boys");
          if(profileSnapshot.child("email").val()===authData.password.email){
          //console.log(profileSnapshot.child("firstName").val());
          $scope.myFirstName = profileSnapshot.child("firstName").val(); // e.g. "barney"
          console.log("Burrrrrr",$scope.myFirstName);
          $scope.$apply();
          $scope.myLastName= profileSnapshot.child("lastName").val();
          $scope.$apply();

        }
          //console.log(email);
        });
      });




      /*
      profileRef.orderByChild('email').equalTo(authData.password.email).on('value', function(dataSnapshot) {
        //$scope.myFirstName = dataSnapshot.val().firstName;
        var x= dataSnapshot.exportVal();
        console.log(x);
        console.log(x[0]);         //console.log(name());
        /*$scope.mySelf=dataSnapshot.val();
        for (var x in $scope.mySelf){
          console.log(x.firstName);
        }
        $scope.$apply();
      }, function(err) {
        console.error(err);
      });

      */





    }]);
})();
