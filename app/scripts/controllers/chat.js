(function() {
  'use strict';
  /**
   * @ngdoc controller
   * @name daiictSenTeam13App.controller:ChatCtrl
   * @description
   * # ChatCtrl
   * Chat Controller of the daiictSenTeam13App
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

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ChatCtrl#initMaterial
       * @methodOf daiictSenTeam13App.controller:ChatCtrl
       * @description
       * Initialises the Materialize modules.
       * @returns {undefined} Does not return anything.
       */
      $scope.initMaterial = function() {
        $(document).ready(function() {
          $(".button-collapse").sideNav({
            closeOnClick: $(window).width() > '991' ? false : true
          });
          $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
          });
        });
      };
      $scope.initMaterial();

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ChatCtrl#logout
       * @methodOf daiictSenTeam13App.controller:ChatCtrl
       * @description
       * Ends the user's session and logs him out.
       * @returns {undefined} Does not return anything.
       */
      $scope.logout = function() {
        ref.unauth();
        $location.path('/');
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ChatCtrl#getData
       * @methodOf daiictSenTeam13App.controller:ChatCtrl
       * @description
       * Fetches all data related to the chat room from the database i.e.
       * active memers and chat history. The function knows which chat room
       * data to load as the unique key of the chatroom in the database is
       * passed in as a route parameter. List of active memebers is store in
       * a scope variable to display in the view. Based on who sent the message
       * (as determined by chat history) meesages sent by the user are right-
       * aligned and messages sent by all others are left-aligned. Also, if the
       * logged in user is the chat room owner, then the kick option is displayed
       * beside each member of the chatroom (apartfrom himself of course). Also, a
       * "view" button is placed beside each active member's email id which on
       * clicking will redirect to the corresponding's user profile. Function called
       * on /chat view load.
       * @returns {undefined} Does not return anything.
       */
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
          $location.path('/chatRooms');
          $timeout(function() {
            $scope.$apply();
          });
        }
      });

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ChatCtrl#sentMessage
       * @methodOf daiictSenTeam13App.controller:ChatCtrl
       * @description
       * This function gets called when the logged in user who is part of the chat room
       * clicks on send. The text in the message input text box is stored in the database
       * as a message of the chat room along with the sender. The message is also instantly
       * displayed on the chat room screen as being sent by the given user.
       * @returns {undefined} Does not return anything.
       */
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

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ChatCtrl#onEnterHit
       * @methodOf daiictSenTeam13App.controller:ChatCtrl
       * @description
       * This function gets called when the logged in user who is part of the chat room
       * hits enter. The text in the message input text box is stored in the database
       * as a message of the chat room along with the sender. The message is also instantly
       * displayed on the chat room screen as being sent by the given user.
       * @returns {undefined} Does not return anything.
       */
      $scope.onEnterHit = function(keyEvent) {
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

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ChatCtrl#kickMember
       * @methodOf daiictSenTeam13App.controller:ChatCtrl
       * @description
       * This function gets called when the logged in user clicks on leave room option
       * On leaving room, the user is deleted from the active members of the chat room
       * and remaining slots for the chat room is incremented, On success, a toast message
       * "Left chat room" is displayed. On error, an error toast is displayed.
       * @returns {undefined} Does not return anything.
       */
      $scope.leaveThisRoom = function() {
        ref.child('chatRooms').child(key).child('members').child(userKey).remove(function(error) {
          console.log($rootScope.userType);
          if (error) {
            Materialize.toast('Cannot Leave Room. Server Error.', 4000);
          } else if ($rootScope.userType === false) {
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

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ChatCtrl#kickMember
       * @methodOf daiictSenTeam13App.controller:ChatCtrl
       * @param {String} memberkey It is the unique key of the user in the active members
       * of the chat room in the database who the chat room owner wants to kick from the chat room.
       * @description
       * This function gets called when the chat room owner clicks on kick option
       * on any of the active members. The member which the chat owner wants to kick
       * is identified by unique id of the active member in the database. On kick,
       * the member is deleted from the active members of the chat room and remaining
       * slots for the chat room is incremented, On success, a toast message
       *  "Kicked member" is displayed. On error, an error toast is displayed.
       * @returns {undefined} Does not return anything.
       */
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

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ChatCtrl#viewMemberProfile
       * @methodOf daiictSenTeam13App.controller:ChatCtrl
       * @param {String} email It is the email address of the user whose profile
       * the logged in user wants to view.
       * @description
       * This function gets called when a logged in user clicks on view
       * profile for any of the users who is in the "people" list. It takes
       * in the email address of the user whose profile the logged in user
       * wants to view.The argument is passed as the route parameter when the function
       * redirects the user to the profile page he wishes to view.
       * @returns {undefined} Does not return anything.
       */
      $scope.viewMemberProfile = function(email) {
        $location.path('/viewProfile').search({
          'profileId': email
        });
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ChatCtrl#goTo
       * @methodOf daiictSenTeam13App.controller:ChatCtrl
       * @param {string} page String that is passed according to
       * the option clicked by the user in the navigation drawer
       * displayed to the left of the screen.
       * @description
       * This function is used to redirect the user to either of
       * the 4 pages, that are profile page, chatRooms page,
       * jobs page or people page, based on what he/she has
       * clicked on in the navigation bar displayed in the left
       * of the screen. Note the following
       * 1. A professor is redirected to '/createChat' on clicking
       * "Chat Rooms" in the nav bar whereas a student is redirected
       * to '/chatRooms'.
       * 2. A professor is redirected to '/posting' on clicking
       * 'Jobs' whereas a student is redirected to '/jobs'.
       * @returns {undefined} Does not return anything.
       */
      $scope.goTo = function(page) {
        switch (page) {
          case 'home':
            if ($rootScope.userType === true) {
              $location.path('/faculty');
            } else {
              $location.path('/student');
            }
            break;
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
