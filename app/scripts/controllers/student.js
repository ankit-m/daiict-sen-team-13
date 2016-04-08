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
    .controller('StudentCtrl', ['$scope', '$location', '$timeout', '$rootScope', function($scope, $location, $timeout, $rootScope) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();
      var self = this;

      $scope.jobs = {};
      $scope.chatRooms = {};
      $scope.loading = true;

      if (authData) {
        console.log("Authenticated user with uid:", authData);
      } else {
        $location.path('/');
      }

      if ($rootScope.userType === true) {
        $location.path('/faculty');
      }

      function getData() {
        console.log('getData called');
        ref.child('postings').limitToFirst(4).once('value', function(dataSnapshot) {
          $scope.jobs = dataSnapshot.val();
          console.log($scope.jobs);
        }, function(err) {
          console.error(err);
        });

        ref.child('chatRooms').limitToFirst(4).once('value', function(dataSnapshot) {
          $scope.chatRooms = dataSnapshot.val();
          console.log($scope.chatRooms);
        }, function(err) {
          console.error(err);
        });

        ref.child('applications').orderByChild('appliedBy').equalTo(authData.password.email).on('value', function(dataSnapshot) {
          $scope.applications = dataSnapshot.val();
          console.log($scope.applications);
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

      $scope.initMaterial = function() {
        $(document).ready(function() {
          $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
          });
        });
        $(".button-collapse").sideNav();
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


      self.logout = function() {
        ref.unauth();
        $location.path('/');
      };

      self.applyForJob = function(jobId, jobName) {
        ref.child('applications').orderByChild('appliedBy').equalTo(authData.password.email).once('value', function(data) {
          if (data.val() !== null) {
            Materialize.toast('You have already applied.', 4000);
          } else {
            $location.path('/application').search({
              'jobId': jobId,
              'jobName': jobName
            });
          }
        });

      };

      self.joinChatRoom = function(chatRoomId) {
        //check joining condition
        $location.path('/chat').search({
          'roomId': chatRoomId
        });
      };

    }]);
})();
