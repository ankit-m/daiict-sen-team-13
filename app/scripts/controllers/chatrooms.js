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

      $scope.initMaterial = function() {
        $(document).ready(function() {
          $('.modal-trigger').leanModal();
          $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
          });
        });
      };
      $scope.initMaterial();

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

      $scope.logout = function() {
        ref.unauth();
        $location.path('/');
      };

      function getData() {
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
      getData();

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

      self.openChatRoom = function(key, chatRoom) {
        ref.child('chatRooms').child(key).child('members').once('value', function(data) {
          if (validate(data, chatRoom)) {
            ref.child('chatRooms').child(key).child('members').push({
              "emailId": authData.password.email,
              "kicked": 0,
              "active": 1
            });
            ref.child('chatRooms').child(key).update({
              'slots': chatRoom.slots - 1
            }); // add  error check
            $location.path('/chat').search({
              'roomId': key
            });
            $timeout(function() {
              $scope.$apply();
            });
          }
        });
      };

    }]);
})();
