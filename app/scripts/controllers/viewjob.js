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

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ViewjobCtrl#getJobData
       * @methodOf daiictSenTeam13App.controller:ViewjobCtrl
       * @description
       * Thus function is called on /viewJob.html page load. The jobId route
       * parameter passed is used to look up the corresponding job's applications
       * in the database and stored in a scope variable so that a professor can
       * view all applications for that corresponding job.
       * @returns {undefined} Does not return anything.
       */
      function getJobData() {
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
      getJobData();

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ViewjobCtrl#initMaterial
       * @methodOf daiictSenTeam13App.controller:ViewjobCtrl
       * @description
       * Initialises the Matrialise modules.
       * @returns {undefined} Does not return anything.
       */
      $scope.initMaterial = function() {
        $(document).ready(function() {
          $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
          });
        });
        $(".button-collapse").sideNav();
      };
      $scope.initMaterial();

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ViewjobCtrl#logout
       * @methodOf daiictSenTeam13App.controller:ViewjobCtrl
       * @description
       * Ends the user's session and logs him out. 
       * @returns {undefined} Does not return anything.
       */
      $scope.logout = function() {
        console.log('logout called');
        ref.unauth();
        console.log('logged out');
        $location.path('/');
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ViewjobCtrl#acceptApplication
       * @methodOf daiictSenTeam13App.controller:ViewjobCtrl
       * @param {string} applicationId Unique key in the database to identify
       * an application for a given job.
       * @description
       * This function is called when a professor clicks on accept application
       * on a particular application for a particualr job. When the professor
       * clicks on accept, the corresponding application's application id is
       * passed as a parameter to this function. The application's status is
       * updated as "accept" in the database after searching for the application
       * in the database. An error toast message is generated if updation fails.
       * Else, a toast with the message 'Accept Notification sent' is displayed.
       * @returns {undefined} Does not return anything.
       */
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

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ViewjobCtrl#rejectApplication
       * @methodOf daiictSenTeam13App.controller:ViewjobCtrl
       * @param {string} applicationId Unique key in the database to identify
       * an application for a given job.
       * @description
       * This function is called when a professor clicks on reject application
       * on a particular application for a particualr job. When the professor
       * clicks on reject, the corresponding application's application id is
       * passed as a parameter to this function. The application's status is
       * updated as "reject" in the database after searching for the application
       * in the database. An error toast message is generated if updation fails.
       * Else, a toast with the message 'Reject Notification sent' is displayed.
       * @returns {undefined} Does not return anything.
       */
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

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ViewjobCtrl#goTo
       * @methodOf daiictSenTeam13App.controller:ViewjobCtrl
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
