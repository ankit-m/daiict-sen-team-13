(function() {
  'use strict';
  /**
   * @ngdoc controller
   * @name daiictSenTeam13App.controller:StudentCtrl
   * @description
   * # StudentCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('FacultyCtrl', ['$scope', '$location', '$rootScope', '$timeout', function($scope, $location, $rootScope, $timeout) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();
      var self = this;
      var postingRef = new Firebase('https://sfip.firebaseio.com/postings');

      $scope.loading = true;
      $scope.chatRooms = {};

      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }

      if ($rootScope.userType === false) {
        $location.path('/student');
      }

      function getData() {
        $scope.loading = true;
        postingRef.orderByChild('postedBy').equalTo(authData.password.email).on('value', function(dataSnapshot) {
          $scope.createdJobs = dataSnapshot.val();
          console.log($scope.createdJobs);
        }, function(err) {
          console.error(err);
        });

        ref.child('chatRooms').orderByChild('createdBy').equalTo(authData.password.email).once('value', function(dataSnapshot) {
          $scope.chatRooms = dataSnapshot.val();
          console.log($scope.chatRooms);
          $timeout(function() {
            $scope.$apply();
          });
          $scope.loading = false;
        });
      }
      getData();

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
        ref.unauth();
        $location.path('/');
      };

      self.showAllChatRooms = function() {
        $location.path('/chatRooms');
      };

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
      };

      self.deleteChatRoom = function(chatRoomId) {
        ref.child('chatRooms').child(chatRoomId).remove(function(error) {
          if (error) {
            Materialize.toast('Could not Delete Chat Room. Try later', 4000);
          } else {
            Materialize.toast('Deleted Chat Room', 4000);
            $timeout(function() {
              $scope.$apply();
            });
          }
        });
      };

      self.showAllJobs = function() {
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

    }]);
})();
