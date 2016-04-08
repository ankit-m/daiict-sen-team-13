(function() {
  'use strict';
  /**
   * @ngdoc function
   * @name daiictSenTeam13App.controller:StudentCtrl
   * @description
   * # StudentCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('FacultyCtrl', ['$scope', '$location','$rootScope','$timeout',function($scope, $location, $rootScope,$timeout) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();
      $scope.loading=true;
      var self=this;
      var postingRef = new Firebase('https://sfip.firebaseio.com/postings');

      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }

       if($rootScope.userType===false){
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

      $scope.logout = function() {
        console.log('logout called');
        ref.unauth();
        console.log('logged out');
        $location.path('/');
      };

       ref.child('chatRooms').once('value', function(dataSnapshot) {
        $scope.loading = true;
        $scope.chatRooms = dataSnapshot.val();
        var chatRoom=null;
        console.log($scope.chatRooms);
        for(chatRoom in $scope.chatRooms){
          if($scope.chatRooms[chatRoom].createdBy===authData.password.email){
              $scope.chatRooms[chatRoom].myRoom=true;
          }
        }
        $timeout(function() {
          $scope.$apply();
        });
        $scope.loading = false;    
      });


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
              "kicked": 0
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

      function getData() {
        console.log('getData called');
        postingRef.orderByChild('postedBy').equalTo(authData.password.email).on('value', function(dataSnapshot) {
          $scope.createdJobs = dataSnapshot.val();
          console.log($scope.createdJobs);
          $timeout(function() {
            $scope.$apply();
          });
          $scope.loading = false;
        }, function(err) {
          console.error(err);
        });

        console.log('getData return');
      }
      getData();

     

      self.showAll = function() {
      $location.path('/jobs');
      };

      self.viewJob = function(jobId) {
        console.log(jobId);
        $location.path('/viewJob').search({
          'jobId': jobId
        });
      };

      self.deleteJob = function(jobId) { //atomize this request
        console.log('delete job');
        ref.child('postings').child(jobId).remove(function(error) {
          if (error) {
            Materialize.toast('Could not Delete Job. Try later', 4000);
          }
        });
        ref.child('application').child(jobId).remove(function(error) {
          if (error) {
            Materialize.toast('Could not Delete Job. Try later', 4000);
          } else {
            Materialize.toast('Deleted Job', 4000);
          }
        });
      };

      self.showAllChatRooms=function(){
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

        self.openChatRoom = function(key, chatRoom) {
        ref.child('chatRooms').child(key).child('members').once('value', function(data) {
          if (validate(data, chatRoom)) {
            ref.child('chatRooms').child(key).child('members').push({
              "emailId": authData.password.email,
              "kicked": 0
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
