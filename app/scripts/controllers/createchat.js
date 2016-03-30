(function() {
  'use strict';
  /**
   * @ngdoc function
   * @name daiictSenTeam13App.controller:CreatechatCtrl
   * @description
   * # CreatechatCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('CreatechatCtrl', ['$scope', '$location', function($scope, $location) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var chatRoomRef = new Firebase('https://sfip.firebaseio.com/chatRooms');
      var memberRef = new Firebase('https://sfip.firebaseio.com/chatRooms/members');
      var authData = ref.getAuth();
      var id = 0;

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


      chatRoomRef.once("value", function(snapshot) {
        id = snapshot.numChildren();

      });


      $scope.makeChat = function() {
        console.log("yo");




        console.log('createChat called');
        //console.log($scope.day);

        var newChatRef = chatRoomRef.push({

          "chatRoomId": id+1,
          "chatRoomName": $scope.chatName,
          "createdBy": authData.password.email,
          "timeStarted": $scope.startTime,
          //"day": $scope.day,
          "description": $scope.chatDescription,
          "active": "1",
        }, function(error) {
          if (error) {
            console.error('Could not create Job');
          } else {



            var path = newChatRef.key();
            var tempRef = new Firebase("https://sfip.firebaseio.com/chatRooms/" + path + "/members");
            tempRef.push({
              "email": authData.password.email
            }, function(error) {
              if (error) {
                console.error('Could not create Job');
              } else {
                console.log('Created Job');
              }
            });


            console.log('Created Job');
          }
        });






        console.log('createJob return');

      };



    }]);
})();
