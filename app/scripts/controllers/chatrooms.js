(function() {
  'use strict';
  //TODO: date UTC format
  /**
   * @ngdoc function
   * @name daiictSenTeam13App.controller:ChatroomsCtrl
   * @description
   * # ChatroomsCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('ChatroomsCtrl', ['$scope', '$location', '$timeout', function($scope, $location, $timeout) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();
      var chatRoomKey = "";
      var chatRoomRef = new Firebase('https://sfip.firebaseio.com/chatRooms');

      $scope.chatHistory = [];
      $scope.members = [];


      $scope.jobs = {};

      $scope.initCollapsible = function() {
        $(document).ready(function() {
          $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
          });
        });
      };
      $scope.initCollapsible();

      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }

      $scope.initMaterial = function() {
        $('.modal-trigger').leanModal();
      };
      $scope.initMaterial();

      ref.child('chatRooms').once('value', function(dataSnapshot) {
        console.log("gotta say hello");
        $scope.chatRooms = dataSnapshot.val();
        console.log($scope.chatRooms);
        $timeout(function() {
          $scope.$apply();
        });

      }, function(err) {
        console.error(err);
      });

      $scope.openChatRoom = function(key) {
        var addMemberRef = new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + '/members/');
        var count = 0;
        addMemberRef.once('value', function(dataSnapshot) {
          dataSnapshot.forEach(function(memberSnapshot) {
            console.log("redirecting one", memberSnapshot.child("emailId").val());
            if (memberSnapshot.child("emailId").val() === authData.password.email) {
              //console.log(profileSnapshot.child("firstName").val());
              count = count + 1;
            }
            //console.log(email);
          });

          console.log("count is", count);
          if (count === 0) {
            addMemberRef.push({
              "emailId": authData.password.email
            });
          }
        });

        //addMemberRef.push(authData.password.email);
        $location.path('/chat').search({
          'roomId': key
        });

      };
    }]);
})();
