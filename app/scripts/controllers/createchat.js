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

      if (authData && $rootScope.userType) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }

      if ($rootScope.userType === false) {
        $location.path('/student');
      }

      $scope.initMaterial = function() {
        $(document).ready(function() {
          $(".button-collapse").sideNav({
            closeOnClick: $(window).width() > 991 ? false : true
          });
          $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
          });
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

      self.resetValues = function() {
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

      function validate(members) {
        for (var member in members) {
          if (member.emailId === authData.password.email) {
            return false;
          }
        }
        return true;
      }

      self.openChatRoom = function(key) {
        ref.child('chatRooms').child(key).once('value', function(dataSnapshot) {
          if (validate(dataSnapshot.val().members)) {
            ref.child('chatRooms').child(key).child('members').push({
              'emailId': authData.password.email,
              'kicked': 0,
              'active': 1
            }, function(error) {
              if (error) {
                console.log(error);
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
          case 'home':
            $location.path('/faculty');
            break;
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
