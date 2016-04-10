(function() {
  'use strict';
  /**
   * @ngdoc controller
   * @name daiictSenTeam13App.controller:ChatCtrl
   * @description
   * # ChatCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('ChatCtrl', ['$scope', '$location', '$routeParams', '$timeout', '$window', '$rootScope', function($scope, $location, $routeParams, $timeout, $window, $rootScope) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();
      var key = $routeParams.roomId;
      var userKey = '';
      var tempChatRoomRef = new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/");

      $scope.loading = true;
      $scope.chatHistory = [];
      $scope.members = [];
      $scope.kicked = false;
      $scope.leaveRoom = false;
      $scope.createdBy = "";
      $scope.kickMyself = false;

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
          $(".button-collapse").sideNav();
        });
      };
      $scope.initMaterial();

      $scope.logout = function() {
        ref.unauth();
        $location.path('/');
      };

      function getData() {
        ref.child('chatRooms').child(key).on('value', function(data) {
          $scope.createdBy = data.val().createdBy;
          $scope.slots = data.val().slots;
          $scope.chatHistory = data.val().messages;
          $scope.members = data.val().members;

          for (var message in $scope.chatHistory) {
            if ($scope.chatHistory[message].sender === authData.password.email) {
              $scope.chatHistory[message].sender = "You:";
              $scope.chatHistory[message].alignment = "right-align";
            } else {
              $scope.chatHistory[message].sender += ":";
              $scope.chatHistory[message].alignment = "left-align";
            }
          }

          for (var member in $scope.members) {
            if ($scope.members[member].active === 1 && authData.password.email === $scope.createdBy && authData.password.email !== $scope.members[member].emailId) {
              $scope.members[member].showKick = true;
            } else if ($scope.members[member].emailId === authData.password.email) {
              userKey = member;
            } else {
              $scope.members[member].showKick = false;
            }
          }

          $scope.loading = false;
          $timeout(function() {
            $scope.$apply();
          });
        });
      }
      getData();

      ref.child('chatRooms').child(key).child('members').on('child_removed', function(dataSnapshot) {
        if (dataSnapshot.val().emailId === authData.password.email) {
          Materialize.toast('You were kicked', 4000);
          $location.path('/chatRooms');
          $timeout(function() {
            $scope.$apply();
          });
        }
      });

      $scope.sentMessage = function() {
        if ($scope.messageInput !== "") {
          tempChatRoomRef.child("messages").push({
            "sender": authData.password.email,
            "text": $scope.messageInput
          });
          $scope.messageInput = "";
          $timeout(function() {
            $scope.$apply();
          });
        }
      };

      $scope.myFunct = function(keyEvent) {
        if (keyEvent.which === 13) {
          if ($scope.messageInput !== "") {
            var tempChatRoomRef = new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/");
            tempChatRoomRef.child("messages").push({
              "sender": authData.password.email,
              "text": $scope.messageInput,
            });
            $scope.messageInput = "";
            $timeout(function() {
              $scope.$apply();
            });
          }
        }
      };

      $scope.leaveThisRoom = function() {
        ref.child('chatRooms').child(key).child('members').child(userKey).remove(function(error) {
          if (error) {
            Materialize.toast('Cannot Leave Room. Server Error.', 4000);
          } else if ($rootScope.userType !== true) {
            ref.child('chatRooms').child(key).child('slots').transaction(function(remainingSlots) {
              return remainingSlots + 1;
            }, function(error, committed) {
              if (error) {
                //server error
              } else if (!committed) {
                //slots taken
                //rollback
              } else {
                Materialize.toast('Left Chat Room.', 4000);
                $timeout(function() {
                  $scope.$apply();
                });
              }
            });
          } else {
            $timeout(function() {
              $scope.$apply();
            });
          }
        });
      };

      $window.onbeforeunload = function() {
        $scope.leaveThisRoom();
      };

      $scope.kickMember = function(memberkey) {
        ref.child('chatRooms').child(key).child('members').child(memberkey).remove(function(error) {
          if (error) {
            Materialize.toast('Cannot Delete Member', 4000);
          } else {
            ref.child('chatRooms').child(key).child('slots').transaction(function(remainingSlots) {
              return remainingSlots + 1;
            }, function(error, committed) {
              if (error) {
                //server error
              } else if (!committed) {
                //slots taken
                //rollback
              } else {
                Materialize.toast('Kicked Member', 2000);
                $scope.$apply();
              }
            });
          }
        });
      };

      $scope.viewMemberProfile = function(email) {
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
            if ($rootScope.userType === true) {
              $location.path('/createChat');
            } else {
              $location.path('/chatRooms');
            }
            break;
          case 'jobs':
            if ($rootScope.userType === true) {
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
    }]);
})();
