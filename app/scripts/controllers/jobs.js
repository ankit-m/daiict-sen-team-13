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

      $scope.loading = true;
      $scope.jobPostings = {};
      $location.url($location.path());
      $rootScope.userType = sessionStorage.getItem('userType');
      $scope.userType = $rootScope.userType;

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:JobsCtrl#initMaterial
       * @methodOf daiictSenTeam13App.controller:JobsCtrl
       * @description
       * Initialises the Matrialise modules.
       * @returns {undefined} Does not return anything.
       */
      $scope.initMaterial = function() {
        $(document).ready(function() {
          $(".button-collapse").sideNav({
            'closeOnClick': $(window).width() > 991 ? false : true
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

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:JobsCtrl#getData
       * @methodOf daiictSenTeam13App.controller:JobsCtrl
       * @description
       * Gets a list of all the active jobs. Function is called on '/jobs' page view load
       * The function is called on '/jobs' page view load. The jobs object is stored in a
       * scope variables variable so that it can be used in the view for displaying
       * all active jobs.
       *
       * @returns {undefined} Does not return anything.
       */
      function getData() {
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
      }
      getData();

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:JobsCtrl#goTo
       * @methodOf daiictSenTeam13App.controller:JobsCtrl
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
            if ($rootScope.userType === 'true') {
              $location.path('/faculty');
            } else {
              $location.path('/student');
            }
            break;
          case 'profile':
            $location.path('/profile');
            break;
          case 'chatRooms':
            if ($rootScope.userType === 'true') {
              $location.path('/createChat');
            } else {
              $location.path('/chatRooms');
            }
            break;
          case 'jobs':
            if ($rootScope.userType === 'true') {
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
       * @name daiictSenTeam13App.controller:JobsCtrl#logout
       * @methodOf daiictSenTeam13App.controller:JobsCtrl
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
       * @name daiictSenTeam13App.controller:JobsCtrl#applyForJob
       * @methodOf daiictSenTeam13App.controller:JobsCtrl
       * @param {string} jobId Unique id which identifies a job
       * object entry in the database corresponding to the job which
       * student is trying to apply for.
       * @param {string} jobName Name of the job as stored in the database
       * for which student is trying to apply.
       * @description
       * This function is called when a student clicks on apply job for any
       * of the job from the job list displayed on the '/jobs' view. It takes
       * in as input the jobId and the jobName of that job. It then checks whether
       * the given student has already applied for the given job. If that is the
       * case, a toast message is displayed saying "You've already applied for this
       * job." If the student hasn't previously applied for the job, he is redirected
       * to the /application view where he can upload his resume, statament of purpose.
       * jobId and jobName are the route parameters passed to /application page.
       *
       * @returns {undefined} Does not return anything.
       */
      $scope.applyForJob = function(jobId, jobName) {
        ref.child('applications').orderByChild('appliedBy').equalTo(authData.password.email).once('value', function(data) {
          var applied = false;
          for (var application in data.val()) {
            if (data.val()[application].jobId === jobId) {
              applied = true;
              Materialize.toast('You have already applied.', 4000);
            }
          }
          if (applied === false) {
            $location.path('/application').search({
              'jobId': jobId,
              'jobName': jobName
            });
          }
        });
      };

    }]);
})();
