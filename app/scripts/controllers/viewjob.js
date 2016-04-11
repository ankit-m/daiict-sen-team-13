(function() {
  'use strict';
  /**
   * @ngdoc controller
   * @name daiictSenTeam13App.controller:ViewjobCtrl
   * @description
   * # ViewjobCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('ViewjobCtrl', ['$scope', '$location', '$routeParams', '$rootScope', function($scope, $location, $routeParams, $rootScope) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var applicationRef = new Firebase('https://sfip.firebaseio.com/applications');
      var authData = ref.getAuth();
      var jobId = $routeParams.jobId;
      var self = this;
      $scope.loading = true;

      if (authData && jobId) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }

      if ($rootScope.userType === false) {
        $location.path('/student');
      }

      function getData() {
        console.log('getData called');
        applicationRef.orderByChild('jobId').equalTo(jobId).on('value', function(dataSnapshot) {
          $scope.applications = dataSnapshot.val();
          console.log(dataSnapshot.val());
          $scope.$apply();
        }, function(err) {
          console.error(err);
        });
        console.log('getData return');
        $scope.loading = false;
      }
      getData();

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

      $scope.logout = function() {
        console.log('logout called');
        ref.unauth();
        console.log('logged out');
        $location.path('/');
      };

      self.acceptApplication = function(applicationId) {
        console.log('accept');
        ref.child('applications').child(applicationId).update({
          status: 'accept'
        }, function(error) {
          if (error) {
            Materialize.toast('Try again', 4000);
          } else {
            Materialize.toast('Accept Notification sent', 4000);
          }
        });
      };

      self.rejectApplication = function(applicationId) {
        console.log('reject');
        ref.child('applications').child(applicationId).update({
          status: 'reject'
        }, function(error) {
          if (error) {
            Materialize.toast('Try again', 4000);
          } else {
            Materialize.toast('Reject Notification sent', 4000);
          }
        });
      };

      $scope.goTo = function(page) {
        switch (page) {
          case 'home':
            $location.path('/faculty');
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
