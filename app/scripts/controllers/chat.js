(function() {
  'use strict';
  //TODO: date UTC format
  /**
   * @ngdoc function
   * @name daiictSenTeam13App.controller:ChatCtrl
   * @description
   * # ChatCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('ChatCtrl', ['$scope', '$location', '$routeParams', '$timeout', function($scope, $location, $routeParams, $timeout) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();
      var key = $routeParams.roomId;

      $scope.chatHistory = [];
      $scope.members = [];

      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }

      $scope.initMaterial = function() {
        $(document).ready(function() {
          $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
          });
        });
        $(".button-collapse").sideNav();
      };
      $scope.initMaterial();

      $scope.logout = function() {
        console.log('logout called');
        ref.unauth();
        console.log('logged out');
        $location.path('/');
      };

      $scope.initCollapsible = function() {
        $(document).ready(function() {
          $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
          });
        });
      };
      $scope.initCollapsible();

      var chatRoomMemberRef = new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/members/");

      chatRoomMemberRef.on('value', function(dataSnapshot) {
        $scope.members = dataSnapshot.val();
        $timeout(function() {
          $scope.$apply();
        });
      });


      var myChatRoomRef = new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/messages/");
      //console.log("get data called abcde");
      myChatRoomRef.on('value', function(dataSnapshot) {
        console.log(dataSnapshot.val());
        $scope.chatHistory = dataSnapshot.val();
        $timeout(function() {
          $scope.$apply();
        });
      });

      $scope.sentMessage = function() {
        if ($scope.messageInput === "") {
          alert("Enter some message to send before pressing enter.");
        } else {
          console.log("Enterrrrrrrrrrrrr");
          var tempChatRoomRef = new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/");
          tempChatRoomRef.child("messages").push({

            "sender": authData.password.email,
            "text": $scope.messageInput

          });
          $scope.messageInput = "";
          $timeout(function() {
            $scope.$apply();
          });
          //$scope.displayChatMessage(authData.password.email, $scope.messageInput);
        }
      };

      $scope.myFunct = function(keyEvent) {
        if (keyEvent.which === 13) {
          if ($scope.messageInput === "") {
            alert("Enter some message to send before pressing enter.");
          } else {
            console.log("Enterrrrrrrrrrrrr");
            var tempChatRoomRef = new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/");
            tempChatRoomRef.child("messages").push({
              "sender": authData.password.email,
              "text": $scope.messageInput
            });
            $timeout(function() {
              $scope.$apply();
            });
          }
        }
      };

    }]);
})();
