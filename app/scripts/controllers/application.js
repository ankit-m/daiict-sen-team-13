(function() {
  'use strict';
  /**
   * @ngdoc controller
   * @name daiictSenTeam13App.controller:ApplicationCtrl
   * @description
   * # ApplicationCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('ApplicationCtrl', ['$scope', '$location', '$routeParams', '$window', '$rootScope', '$timeout',
      function($scope, $location, $routeParams, $window, $rootScope, $timeout) {
        var ref = new Firebase('https://sfip.firebaseio.com/');
        var authData = ref.getAuth();
        var jobId = $routeParams.jobId;
        var jobName = $routeParams.jobName;
        var job = {};

        $scope.loading = true;
        $scope.jobName = '';
        $scope.letter = '';
        $scope.contactEmail = '';
        $scope.attachment = '';

        if (authData && jobId && jobName) {
          console.log("Authenticated user with uid:", authData.uid);
        } else {
          $location.path('/');
        }

        if ($rootScope.userType === true) {
          $location.path('/faculty');
        }

        /**
         * @ngdoc function
         * @name daiictSenTeam13App.controller:ApplicationCtrl#initMaterial
         * @methodOf daiictSenTeam13App.controller:ApplicationCtrl
         * @description
         * Initialises the Matrialise modules.
         * @returns {undefined} Does not return anything.
         */
        $scope.initMaterial = function() {
          $(document).ready(function() {
            $(".button-collapse").sideNav({
              closeOnClick: $(window).width() > 991 ? false : true
            });
            $('.modal-trigger').leanModal();
          });
        };
        $scope.initMaterial();

        /**
         * @ngdoc function
         * @name daiictSenTeam13App.controller:ApplicationCtrl#resetValues
         * @methodOf daiictSenTeam13App.controller:ApplicationCtrl
         * @description
         * Resets all the input fields that were filled by the student who is
         * attempting to apply for a job.
         * @returns {undefined} Does not return anything.
         */
        $scope.resetValues = function() {
          document.getElementById("applicationForm").reset();
          $('#letter').trigger('autoresize');
        };
        $scope.resetValues();

        /**
         * @ngdoc function
         * @name daiictSenTeam13App.controller:ApplicationCtrl#logout
         * @methodOf daiictSenTeam13App.controller:ApplicationCtrl
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
         * @name daiictSenTeam13App.controller:ApplicationCtrl#getData
         * @methodOf daiictSenTeam13App.controller:ApplicationCtrl
         * @description
         * Function called when /application page loads. The unique jobId of the
         * job for which student wants to apply is passed to this view as a
         * route parameter. The name of the job is retrieved based on this jobId
         * and stored in a scope variable for displaying in the view.
         * @returns {undefined} Does not return anything.
         */
        function getData() {
          ref.child('postings').orderByKey().equalTo(jobId).once('value', function(dataSnapshot) {
            job = dataSnapshot.val();
            console.log(job);
            for (var index in job) {
              $scope.jobName = job[index].jobName;
              break;
            }
            $scope.loading = false;
            $timeout(function() {
              $scope.$apply();
            });
            $scope.loading = false;
          }, function(err) {
            console.error(err);
          });
        }
        getData();

        /**
         * @ngdoc function
         * @name daiictSenTeam13App.controller:ApplicationCtrl#validate
         * @methodOf daiictSenTeam13App.controller:ApplicationCtrl
         * @description
         * Validation function called when user tries to submit application for
         * the job selected. Only if all fields are filled in, validate will return true.
         * @returns {boolean} Whether data is valid or not
         */
        $scope.validate = function() {
          if (!/([^\s])/.test($scope.letter) || !/([^\s])/.test($scope.contactEmail)) {
            Materialize.toast('All fields are required', 4000);
            return false;
          }
          return true;
        };

        /**
         * @ngdoc function
         * @name daiictSenTeam13App.controller:ApplicationCtrl#submitApplication
         * @methodOf daiictSenTeam13App.controller:ApplicationCtrl
         * @description
         * This function is called when the student clicks on submit application. The
         * validate function is called and if it returns true, an application for the
         * given job is stored in the database, including informaton such as who applied
         * contact email of the member who applied, the cover letter, date submitted on,
         * jobId, job name etc. On error, a toast message is displayed prompting to try
         * again later. Else, application is submitted successfully.
         * @returns {undefined} Does not return anything.
         */
        $scope.submitApplication = function() {
          if ($scope.validate()) {
            ref.child('applications').push({ //add server validation
              "appliedBy": authData.password.email,
              "contactEmail": $scope.contactEmail,
              "letter": $scope.letter,
              "attachment": $scope.attachment,
              "submittedOn": Firebase.ServerValue.TIMESTAMP,
              "jobId": jobId,
              "jobName": jobName
            }, function(error) {
              if (error) {
                Materialize.toast('Server error. Try again later', 4000);
                $window.history.back();
                $timeout(function() {
                  $scope.$apply();
                });
              } else {
                Materialize.toast('Application Submitted', 4000);
                $window.history.back();
                $timeout(function() {
                  $scope.$apply();
                });
              }
            });
          }
        };

        /**
         * @ngdoc function
         * @name daiictSenTeam13App.controller:ApplicationCtrl#goTo
         * @methodOf daiictSenTeam13App.controller:ApplicationCtrl
         * @param {string} page String that is passed according to
         * the option clicked by the user in the navigation drawer
         * displayed to the left of the screen.
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
                $location.path('/student');
              break;
            case 'profile':
              $location.path('/profile');
              break;
            case 'chatRooms':
                $location.path('/chatRooms');
              break;
            case 'jobs':
                $location.path('/jobs');
              break;
            case 'people':
              $location.path('/people');
              break;
            default:
              $location.path('/');
          }
        };

      }
    ]);
})();
