(function() {
  'use strict';
  /**
   * @ngdoc controller
   * @name daiictSenTeam13App.controller:JobsCtrl
   * @description
   * # JobsCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('JobsCtrl', ['$scope', '$location', '$rootScope', '$timeout', function($scope, $location, $rootScope, $timeout) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();
      var self = this;

      $scope.loading = true;
      $scope.jobPostings = {};

      $scope.initMaterial = function() {
        $(document).ready(function() {
          $(".button-collapse").sideNav({
            closeOnClick: $(window).width() > 991 ? false : true
          });
          $('.collapsible').collapsible({
            accordion: false
          });
        });
      };
      $scope.initMaterial();

      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }

      ref.child('postings').once('value', function(dataSnapshot) {
        $scope.jobPostings = dataSnapshot.val();
        console.log($scope.jobPostings);
        $scope.loading = false;
        $timeout(function() {
          $scope.$apply();
        });
      }, function(err) {
        console.error(err);
      });

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

      $scope.logout = function() {
        ref.unauth();
        $location.path('/');
      };

      self.applyForJob = function(jobId, jobName) {
        $location.path('/application').search({
          'jobId': jobId,
          'jobName': jobName
        });
      };

    }]);
})();
