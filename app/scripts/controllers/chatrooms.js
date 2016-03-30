(function() {
  'use strict';
  /**
   * @ngdoc function
   * @name daiictSenTeam13App.controller:ChatroomsCtrl
   * @description
   * # ChatroomsCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('ChatroomsCtrl', ['$scope', '$location', function($scope, $location) {

      var ref = new Firebase('https://sfip.firebaseio.com/');
      var chatRoomRef = new Firebase('https://sfip.firebaseio.com/chatRooms');
      var profileRef = new Firebase('https://sfip.firebaseio.com/profile/');
      var memberRef = new Firebase('https://sfip.firebaseio.com/chatRooms/members');
      var authData = ref.getAuth();

      $scope.creatorNames=[];

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

      function getData() {

        console.log('getData called');
        chatRoomRef.orderByChild('active').equalTo("1").on('value', function(dataSnapshot) {
          $scope.chatRooms = dataSnapshot.val();
          console.log($scope.chatRooms);

            dataSnapshot.forEach(function(dataSnapshot){

              profileRef.once("value", function(allProfilesSnapshot) {
                allProfilesSnapshot.forEach(function(profileSnapshot) {
                  // Will be called with a messageSnapshot for each child under the /messages/ node
                  //var key = profileSnapshot.key(); // e.g. "-JqpIO567aKezufthrn8"

                  if (profileSnapshot.child("email").val() === dataSnapshot.child("createdBy").val()) {
                    //console.log(profileSnapshot.child("firstName").val());
                    console.log(profileSnapshot.child("firstName").val());
                    $scope.creatorNames.push(profileSnapshot.child("firstName").val()); // e.g. "barney"
                    $scope.$apply();
                    //console.log($scope.creatorNames);

                  }

                });
              });


            });
          $scope.$apply();
        }, function(err) {
          console.error(err);
        });

        chatRoomRef.orderByChild('createdBy').equalTo(authData.password.email).on('value', function(dataSnapshot) {
          $scope.myChatRooms = dataSnapshot.val();

          //console.log($scope.chatRooms);
          $scope.$apply();
        }, function(err) {
          console.error(err);
        });




        console.log('getData return');
      }
      getData();

      /*     $scope.enterChatRoom = function(chatRoomId){
         console.log(chatRoomId);
         $location.path('/enterChatRoom').search({'chatRoomId':chatRoomId});
       };
*/









      // };



    }]);
})();
