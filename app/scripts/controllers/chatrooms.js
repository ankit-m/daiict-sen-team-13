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
    .controller('ChatroomsCtrl', ['$scope', '$location', '$timeout','$rootScope', function($scope, $location, $timeout,$rootScope) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();
      var self = this;

      $scope.chatHistory = [];
      $scope.members = [];
      $scope.loading = true;
      $scope.jobs = {};
      var slots=0;
      
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
        $scope.loading = true;
        $scope.chatRooms = dataSnapshot.val();
        $timeout(function() {
          $scope.$apply();
        });
        $scope.loading = false;
      }, function(err) {
        console.error(err);
      });

      function validate(data, chatRoom) {
        data.forEach(function(member) {
          if (member.child("emailId").val() === authData.password.email) {
            return false;
          }
        });
        if (chatRoom.slots > 0) {
          return true;
        } else {
          Materialize.toast('Chat room full. Please try again later', 4000);
          return false;
        }
      }

      $scope.openChatRoom = function(key, chatRoom) {
        var tempChatRoomRef = new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/");
         tempChatRoomRef.child("createdBy").on("value",function(snapshot){
         $scope.createdBy=snapshot.val();
        });
        ref.child('chatRooms').child(key).child('members').once('value', function(data) {
          if (validate(data, chatRoom)) {
            var count=0;
               data.forEach(function(memberSnapshot) {
            if (memberSnapshot.child("emailId").val() === authData.password.email) {
              count = count + 1;
              $scope.kicked=memberSnapshot.child("kicked").val();
            }
          });
          if(count===0){
            ref.child('chatRooms').child(key).child('members').push({
              "emailId": authData.password.email,
              "kicked": 0,
              "active":1
            });
          }
          if($scope.kicked>=1)        
             {
              Materialize.toast("You were kicked",4000);
             }
          else {
                ref.child('chatRooms').child(key).child("slots").once('value',function(data){
                slots=data.val();
                ref.child('chatRooms').child(key).update({
                  'slots': slots - 1
                }); // add  error check
                $location.path('/chat').search({
                  'roomId': key
                });
                $timeout(function(){
                $scope.$apply();
                  });
                });     
              }   
          }
        });
      };

      $scope.logout = function() {
        ref.unauth();
        $location.path('/');
      };

      $scope.goTo = function(page) {
        switch (page) {
          case 'profile':
            $location.path('/profile');
            break;
          case 'chatRooms':
            if ($rootScope.userType===true) {
              $location.path('/createChat');
            } else {
              $location.path('/chatRooms');
            }

            break;
          case 'jobs':
            if ($rootScope.userType===true) {
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


  angular.module('daiictSenTeam13App').filter('customChatRooms', function() {
  return function(input, search) {
    if (!input) return input;
    if (!search) return input;
    var expected = ('' + search).toLowerCase();
    var result = {};
    angular.forEach(input, function(value,key) {
      var actual = ('' + value.chatRoomName).toLowerCase();
      var actual2= ('' + value.description).toLowerCase();
      var actual3= ('' + value.days).toLowerCase();
      var actual4= ('' + value.startTime).toLowerCase();

      if (actual.indexOf(expected) !== -1 || actual2.indexOf(expected) !== -1 || actual3.indexOf(expected) !== -1 || actual4.indexOf(expected) !== -1 ){
        result[key] = value;
      }
    });
    return result;
  }
});

})();