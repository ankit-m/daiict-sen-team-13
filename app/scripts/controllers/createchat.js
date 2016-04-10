(function() {
  'use strict';
  /**
   * @ngdoc controller
   * @name daiictSenTeam13App.controller:CreatechatCtrl
   * @description
   * # CreatechatCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('CreatechatCtrl', ['$scope', '$location', '$rootScope', '$timeout', function($scope, $location, $rootScope, $timeout) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();
      var self = this;

      $scope.loading = true;
      $scope.day = 'Monday';

      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }

      if ($rootScope.userType === false) {
        $location.path('/student');
      }

      $scope.initMaterial = function() {
        $(document).ready(function() {
          $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
          });
          $(".button-collapse").sideNav();
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
        ref.child('chatRooms').orderByChild('createdBy').equalTo(authData.password.email).on('value', function(dataSnapshot) {
          $scope.loading = true;
          $scope.chatRooms = dataSnapshot.val();
          console.log($scope.chatRooms);
          $timeout(function() {
            $scope.$apply();
          });
          $scope.loading = false;
        });
      }
      getData();

      self.resetValues = function(){
        document.getElementById("createChatForm").reset();
        document.getElementById("Monday").checked = true;
        $('#chatDescription').trigger('autoresize');
      };

      self.createChatRoom = function() {
        console.log('createChatRoom called');
        ref.child('chatRooms').push({
          "chatRoomName": $scope.chatName,
          "createdBy": authData.password.email,
          "startTime": $scope.startTime,
          "description": $scope.chatDescription,
          "slots": $scope.slots,
          "days": $scope.day,
          "active": false
        }, function(error) {
          if (error) {
            Materialize.toast('Could not create Chat Room. Please try again', 4000);
          } else {
            Materialize.toast('Created Chat Room', 4000);
            self.resetValues();
          }
        });
      };

      self.showAllChatRooms = function() {
        $location.path('/chatRooms');
      };

      function validate(data, chatRoom) {
        data.forEach(function(member) {
          console.log("redirecting one", member.child("emailId").val());
          if (member.child("emailId").val() === authData.password.email) {
            return false;
          }
        });
        if (chatRoom.slots > 0) {
          var currentDate = new Date();
          var currentTime = String(currentDate.getHours()) + ':' + String(currentDate.getMinutes());
          if (currentTime > chatRoom.startTime) {
            var today = new Date();
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
            if (weekday[today.getDay()] === chatRoom.days) {
              return true;
            } else {
              Materialize.toast('Wrong Day. Chat room not open.', 4000);
              return false;
            }
          } else {
            Materialize.toast('Chat room not open yet. Try again later', 4000);
            return false;
          }
        } else {
          Materialize.toast('Chat room full. Please try again later', 4000);
          return false;
        }
      }

      self.openChatRoom = function(key) {
        ref.child('chatRooms').child(key).child('members').push({
          'emailId': authData.password.email,
          'kicked': 0,
          'active': 1
        }, function(error){
          if(error){
            console.log(error);
          } else {
            ref.child('chatRooms').child(key).child('slots').transaction(function(remainingSlots){
              if(remainingSlots === 0){
                return; //rollback
              }
              return remainingSlots - 1;
            }, function(error, committed){
              if (error){
                //server error
              } else if (!committed){
                //slots taken
                //rollback
              } else {
                $location.path('/chat').search({
                  'roomId': key
                });
                $timeout(function() {
                  $scope.$apply();
                });
              }
            });
          }
        });
      };

      self.deleteChatRoom = function(chatRoomId) {
        ref.child('chatRooms').child(chatRoomId).remove(function(error) {
          if (error) {
            Materialize.toast('Could not Delete Chat Room. Try later', 4000);
          } else {
            Materialize.toast('Deleted Chat Room', 4000);
          }
        });
      };

      self.viewMemberProfile = function(email) {
        console.log("some random text");
        $location.path('/viewProfile').search({
          'profileId': email
        });
      };

      $scope.goTo = function(page) {
        switch (page) {
          case 'profile':
            $location.path('/profile');
            break;
          case 'chatRooms':
            $location.path('/createChat');
            break;
          case 'jobs':
            $location.path('/posting');
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
