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
      $location.url($location.path());
      $rootScope.userType = sessionStorage.getItem('userType');

      if (authData && $rootScope.userType) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }


      if ($rootScope.userType === 'false') {
        $location.path('/student');
      }

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:CreatechatCtrl#initMaterial
       * @methodOf daiictSenTeam13App.controller:CreatechatCtrl
       * @description
       * Initialises the Matrialise modules.
       * @returns {undefined} Does not return anything.
       */
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

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:CreatechatCtrl#logout
       * @methodOf daiictSenTeam13App.controller:CreatechatCtrl
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
       * @name daiictSenTeam13App.controller:CreatechatCtrl#getData
       * @methodOf daiictSenTeam13App.controller:CreatechatCtrl
       * @description
       * This method queries the database and retrieves a list of all
       * the chat rooms that have been created by the the currently logged in user.
       * This data is stored in a scope variable "$scope.chatRooms" so that it can
       * be used by the view.
       * @returns {undefined} Does not return anything.
       */
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

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:CreatechatCtrl#resetValues
       * @methodOf daiictSenTeam13App.controller:CreatechatCtrl
       * @description
       * Resets all the input fields that were filled by the user on the
       * create chat page.
       * @returns {undefined} Does not return anything.
       */
      $scope.resetValues = function() {
        document.getElementById("createChatForm").reset();
        document.getElementById("Monday").checked = true;
        $('#chatDescription').trigger('autoresize');
      };

      $scope.validateChatSettings = function(){
        if (!/([^\s])/.test($scope.chatName) || !/([^\s])/.test($scope.chatDescription) || !/([^\s])/.test($scope.slots) || !/([^\s])/.test($scope.day)) {
          Materialize.toast('All fields are necessary', 4000);
          return false;
        } else {
          if (!/([^\s])/.test($scope.startTime) || !/([^\s])/.test($scope.endTime)) {
            Materialize.toast('All time fields are necessary', 4000);
            return false;
          } else if ($scope.startTime >= $scope.endTime) {
            Materialize.toast('Start time should be less that End Time', 4000);
            return false;
          }
        }
        return true;
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:CreatechatCtrl#createChatRoom
       * @methodOf daiictSenTeam13App.controller:CreatechatCtrl
       * @description
       * Creates a new chat room and makes an entry into the database along with all
       * the corresponding chat room details such as createdBy, chat room description,
       * startTime, maximum number of slots etc. as given by the user. If chat room can't
       * be created, a toast message asks user to try again later. On successful chat
       * room creation, a toast message displays "Created chat room" and the resetValues()
       * function is called.
       * @returns {undefined} Does not return anything.
       */
      $scope.createChatRoom = function() {
        if ($scope.validateChatSettings()) {
          ref.child('chatRooms').push({
            "chatRoomName": $scope.chatName,
            "createdBy": authData.password.email,
            "startTime": $scope.startTime,
            "endTime": $scope.endTime,
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
        }
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:CreatechatCtrl#showAllChatRooms
       * @methodOf daiictSenTeam13App.controller:CreatechatCtrl
       * @description
       * Function called when user clicks on show all chat rooms button on the
       * controller's view. The user is redirected to the routr /chatRooms.
       * @returns {undefined} Does not return anything.
       */
       $scope.showAllChatRooms = function(){
        $location.path('/chatRooms');
        $timeout(function() {
          $scope.$apply();
        });
       };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:CreatechatCtrl#validate
       * @methodOf daiictSenTeam13App.controller:CreatechatCtrl
       * @param {object} chatRoom chatRoom object which contains data
       * corresponding to the chatRoom which user is trying to join
       * @description
       * Checks of the faculty is already in the chatRoom.
       * @returns {boolean} Data is valid or not
       */
      $scope.validate = function(chatRoom) {
        for (var member in chatRoom.members) {
          if (chatRoom.members[member].emailId === authData.password.email) {
            Materialize.toast('You are already in the room. Please refresh.', 4000);
            return false;
          }
        }
        return true;
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:CreatechatCtrl#openChatRoom
       * @methodOf daiictSenTeam13App.controller:CreatechatCtrl
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
      $scope.openChatRoom = function(key) {
        ref.child('chatRooms').child(key).once('value', function(dataSnapshot) {
          if ($scope.validate(dataSnapshot.val())) {
            ref.child('chatRooms').child(key).child('members').push({
              'emailId': authData.password.email,
              'kicked': 0,
              'active': 1
            }, function(error) {
              if (error) {
                console.log(error);
              } else {
                ref.child('chatRooms').child(key).update({
                  active: true
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
          }
        });
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:CreatechatCtrl#deleteChatRoom
       * @methodOf daiictSenTeam13App.controller:CreatechatCtrl
       * @param {string} chatRoomId Unique id which identifies a chat room
       * object entry in the database corresponding to the chatRoom which
       * user is trying to delete.
       * @description
       * This function is called when user clicks on delete chat room on any
       * one of the chat room from the list of chat rooms that have been
       * created by him. The chat room on which the user has clicked is identified
       * by the unique chat room key that is passed from the view to the function.
       * The corresponding database entry for thr chat room
       * is deleted so that that particualr room doesn't exist anymore. On
       * successful deletion from database, a toast is displayed with the
       * message "Deleted Chat Room". On error, the user is informed that
       * the corresponding chat room hasn;t been deleted and is prompted to
       * try later.
       *
       */
      $scope.deleteChatRoom = function(chatRoomId) {
        ref.child('chatRooms').child(chatRoomId).remove(function(error) {
          if (error) {
            Materialize.toast('Could not Delete Chat Room. Try later', 4000);
          } else {
            Materialize.toast('Deleted Chat Room', 4000);
          }
        });
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:CreatechatCtrl#goTo
       * @methodOf daiictSenTeam13App.controller:CreatechatCtrl
       * @param {string} page String that is passed according to
       * the option clicked by the user in the navigation drawer
       * displayed to the left of the screen. 'profile' if the
       * profile option was clicked, 'chatRooms' if the chat rooms
       * option was clicked etc.
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
