(function() {
  'use strict';
  /**
   * @ngdoc controller
   * @name daiictSenTeam13App.controller:PostingCtrl
   * @description
   * # PostingCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('PostingCtrl', ['$scope', '$location', '$timeout', '$rootScope', function($scope, $location, $timeout, $rootScope) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var postingRef = new Firebase('https://sfip.firebaseio.com/postings');
      var authData = ref.getAuth();
      var self = this;

      $scope.loading = true;
      $scope.jobName = '';
      $scope.description = '';
      $scope.positions = '';
      $scope.startDate = '';
      $scope.endDate = '';
      $scope.deadline = '';
      $scope.contactEmail = '';
      $scope.location = '';
      $location.url($location.path());
      
      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }
      

      if ($rootScope.userType === false) {
        $location.path('/student');
      }

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:PostingCtrl#initMaterial
       * @methodOf daiictSenTeam13App.controller:PostingCtrl
       * @description
       * Initialises the Matrialise modules.
       * @returns {undefined} Does not return anything.
       */
      $scope.initMaterial = function() {
        $(document).ready(function() {
          $(".button-collapse").sideNav({
            closeOnClick: $(window).width() > 991 ? false : true
          });
        });
      };
      $scope.initMaterial();

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:PostingCtrl#getData
       * @methodOf daiictSenTeam13App.controller:PostingCtrl
       * @description
       * Gets a list of all the jobs that were created by the faculty. Function
       * is called when posting.html view is loaded. The list of createdJobs
       * are stored as scope variables so that they can be used in the view
       * for displaying.
       * @returns {undefined} Does not return anything.
       */
      function getData() {
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
      }
      getData();

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:PostingCtrl#resetValues
       * @methodOf daiictSenTeam13App.controller:PostingCtrl
       * @description
       * Resets all the input fields that were filled by the user when
       * he is creating a job. Called on page load or when user clicks
       * reset.
       * @returns {undefined} Does not return anything.
       */
      $scope.resetValues = function() {
        document.getElementById("postingForm").reset();
        $('#description').trigger('autoresize');
      };
      //$scope.resetValues();

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:PostingCtrl#validate
       * @methodOf daiictSenTeam13App.controller:PostingCtrl
       * @description
       * Validating function which is called when user clicks on
       * create chat button. It performs the following checks
       * 1. All fields in the create chat form must be filled.
       * 2. Start Date should be greater than today
       * 3. Start Date should be lower than End Date
       * 4. Deadline should be lower than Start Date
       * The function returns true if all validation checks are fulfilled
       * else, false is returned.
       * @returns {boolean} Data is valid or not.
       */
       $scope.validate = function(){
        if (!/([^\s])/.test($scope.jobName) || !/([^\s])/.test($scope.description) || !/([^\s])/.test($scope.positions) || !/([^\s])/.test($scope.contactEmail)) {
          Materialize.toast('All fields are required', 4000);
          return false;
        }
        if (!/([^\s])/.test($scope.startDate) || !/([^\s])/.test($scope.endDate) || !/([^\s])/.test($scope.deadline) || !/([^\s])/.test($scope.location)) {
          Materialize.toast('All fields are required', 4000);
          return false;
        }
        if (new Date($scope.startDate) < new Date()) {
          Materialize.toast('Start Date should be greater than today.', 4000);
          return false;
        }
        if (new Date($scope.startDate) > new Date($scope.endDate)) {
          Materialize.toast('Start Date should be lower than End Date', 4000);
          return false;
        }
        if (new Date($scope.deadline) > new Date($scope.startDate)) {
          Materialize.toast('Deadline should be lower than Start Date.', 4000);
          return false;
        }
        return true;
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:PostingCtrl#createJob
       * @methodOf daiictSenTeam13App.controller:PostingCtrl
       * @description
       * Function called when professor clicks on create job button on the
       * controller's view. The validate function of this controller is called
       * to check if all input fields are valid. If so, a new job is created
       * and the related information is stored in the database. If job can't
       * be created, a toast with message "Could not create Job. Please try again later"
       * is displayed. If successfully created, Job Created toast is displayed.
       * @returns {undefined} Does not return anything.
       */
      $scope.createJob = function() {
        if ($scope.validate()) {
          postingRef.push({
            "jobName": $scope.jobName,
            "description": $scope.description,
            "contactEmail": $scope.contactEmail,
            "location": $scope.location,
            "startDate": new Date($scope.startDate),
            "endDate": new Date($scope.endDate),
            "postedBy": authData.password.email,
            "positions": $scope.positions,
            "deadline": new Date($scope.deadline),
            "postedOn": new Date(Firebase.ServerValue.TIMESTAMP)
          }, function(error) {
            if (error) {
              Materialize.toast('Could not create Job. Please try again later.', 4000);
            } else {
              Materialize.toast('Job Created', 4000);
              $scope.resetValues();
            }
          });
        }
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:PostingCtrl#showAll
       * @methodOf daiictSenTeam13App.controller:PostingCtrl
       * @description
       * Function called when user clicks on show all jobs button on the
       * controller's view. The user is redirected to the route /jobs.
       * @returns {undefined} Does not return anything.
       */
      $scope.showAll = function() {
        $location.path('/jobs');
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:PostingCtrl#viewJob
       * @methodOf daiictSenTeam13App.controller:FacultyCtrl
       * @param {string} jobId Unique id which identifies a job
       * object entry in the database corresponding to the job which
       * faculty is trying to view.
       * @description
       * This function is called when faculty clicks on any one of
       * the job in the list of jobs created by him. It takes in as input the
       * unique key for a job in the database i.e. the jobId and redirects the
       * user to the /viewJob page with the jobId given as a route parameter
       * to the route that is being called. The viewJob page will display all
       * applications for the job, list of accepted and rejected applications.
       * @returns {undefined} Does not return anything.
       */
      $scope.viewJob = function(jobId) {
        console.log(jobId);
        $location.path('/viewJob').search({
          'jobId': jobId
        });
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:PostingCtrl#deleteJob
       * @methodOf daiictSenTeam13App.controller:PostingCtrl
       * @param {string} jobId Unique id which identifies a job
       * object entry in the database corresponding to the job which
       * user is trying to delete.
       * @description
       * This function is called when user clicks on delete job on any
       * one of the jobs from the list of jobs that have been
       * created by him. The job on which the user has clicked is identified
       * by the unique jobId of that job that is passed from the view to the function.
       * The corresponding database entry for the job is deleted so that the
       * particular job doesn't exist anymore. On successful deletion from
       * database, a toast is displayed with the message "Deleted Job".
       * On error, the user is informed that the corresponding job hasn't
       * been deleted and is prompted to try later.
       */
      $scope.deleteJob = function(jobId) { //atomize this request
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

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:PostingCtrl#goTo
       * @methodOf daiictSenTeam13App.controller:PostingCtrl
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
            $location.path('/faculty');
            break;
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

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:PostingCtrl#logout
       * @methodOf daiictSenTeam13App.controller:PostingCtrl
       * @description
       * Ends the user's session and logs him out.
       * @returns {undefined} Does not return anything.
       */
      $scope.logout = function() {
        ref.unauth();
        $location.path('/');
      };

    }]);
})();
