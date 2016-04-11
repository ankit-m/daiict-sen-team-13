(function() {
  'use strict';
  /**
   * @ngdoc controller
   * @name daiictSenTeam13App.controller:ChatroomsCtrl
   * @description
   * Conroller for the route '/chatRooms'. It loads up
   * a list of chat rooms that have been created along 
   * with description of each room and the creator.
   */
  angular.module('daiictSenTeam13App')
    .controller('ChatroomsCtrl', ['$scope', '$location', '$timeout', '$rootScope', function($scope, $location, $timeout, $rootScope) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();
      var self = this;

      $scope.chatHistory = [];
      $scope.members = [];
      $scope.loading = true;

      $scope.jobs = {};

      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ChatroomsCtrl#initMaterial
       * @methodOf daiictSenTeam13App.controller:ChatroomsCtrl
       * @description
       * Initialises the Matrialise modules.
       * @returns {undefined} Does not return anything.
       */
      $scope.initMaterial = function() {
        $(document).ready(function() {
          $('.modal-trigger').leanModal();
          $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
          });
        });
      };
      $scope.initMaterial();

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ChatroomsCtrl#goTo
       * @methodOf daiictSenTeam13App.controller:ChatroomsCtrl
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

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ChatroomsCtrl#logout
       * @methodOf daiictSenTeam13App.controller:ChatroomsCtrl
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
       * @name daiictSenTeam13App.controller:ChatroomsCtrl#getChatRooms
       * @methodOf daiictSenTeam13App.controller:ChatroomsCtrl
       * @description
       * This method queries the database and retrieves a list of all
       * the chat rooms that have been created. This data is stored in 
       * a scope variable "$scope.chatRooms" so that it can be used by 
       * the view. On error, a toast is created which displays the error  
       * message with relevant details.
       * @returns {undefined} Does not return anything.
       */
      function getChatRooms() {
        ref.child('chatRooms').once('value', function(dataSnapshot) {
          $scope.chatRooms = dataSnapshot.val();
          console.log($scope.chatRooms);
          $timeout(function() {
            $scope.$apply();
          });
          $scope.loading = false;
        }, function() {
          Materialize.toast('Cannot get Chat Rooms. Try again later', 4000);
        });
      }
      getChatRooms();

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ChatroomsCtrl#validate
       * @methodOf daiictSenTeam13App.controller:ChatroomsCtrl
       * @param {object} members list of members belonging to the 
       * chat room which user is trying to join. 
       * @param {object} chatRoom chatRoom object which contains data
       * corresponding to the chatRoom which user is trying to join
       * @description
       * This function is a validating function called when a user
       * tries to enter a chat room. The function takes in as inputs
       * the chatroom object corresponding to the chat room which the 
       * user tries to enter and a list of members that belong to that
       * chat room(if any). Validation checks applied are 
       * 1. If chat room is full, user is not allowed to join and 
       * false is returned.
       * 2. If chat room is not full, the code then checks if the 
       * chat room is open at the given moment based on the chat room's
       * creators preferences of day and time for which he/she wants the
       * chat room to be open. 
       * 3. If current time is greater than the chat room start time:
       * and if the current day is same as the day which 
       * the creator has set when creating the chat room, the 
       * user is allowed to join and the function returns true. 
       * Else a toast with the message wrong day is displayed and 
       * false is returned by the function.        
       * If the current time is lesser than the chat rooom start time 
       * a toast with the message chat room not open yet is displayed and 
       * the function returns false.
       * @returns {undefined} Does not return anything.
       */
      function validate(members, chatRoom) {
        for (var member in members){
          if(member.emailId === authData.password.email){
            if(member.child.kicked === 1){
              console.log('kicked');
              return false;
            }
          }
        }
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
        return true;
      }

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ChatroomsCtrl#openChatRoom
       * @methodOf daiictSenTeam13App.controller:ChatroomsCtrl
       * @param {string} key Unique key in the database to identify
       * the chat room which user is trying to join 
       * @param {object} chatRoom chatRoom object which contains data
       * corresponding to the chatRoom which user is trying to join
       * @description
       * This function gets called when a user tries to join some chat room
       * from the list of chat rooms displayed on the /chatRooms page. First, the
       * user is validated according to the validate function described above. If 
       * the user is a professor, no validation check is applied. If validate
       * function returns true, the user is added to the list of active members of
       * the corresponding chat room. Databse transactions mechanism is used to 
       * ensure that even if two members who may have been validated by the validate
       * function due to delay in database updations because of the network, they do not 
       * both join the chat room if only one slot is left.
       * @returns {undefined} Does not return anything.
       */
      self.openChatRoom = function(key, chatRoom) {
        ref.child('chatRooms').child(key).once('value', function(dataSnapshot){
          if ($rootScope.userType === true || validate(dataSnapshot.val().members, chatRoom)){
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
                    return;
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
          }
        });
      };

    }]);
})();
