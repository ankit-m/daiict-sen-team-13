(function() {
  'use strict';
  //TODO: date UTC format
  /**
   * @ngdoc function
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
      // $location.search('jobId', null);

      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }

      if ($rootScope.userType === false) {
        $location.path('/student');
      }

      $scope.initMaterial = function() {
        $(document).ready(function() {
          $(".button-collapse").sideNav();
        });
      };
      $scope.initMaterial();

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

      $scope.resetValues = function() {
        document.getElementById("postingForm").reset();
        $('#description').trigger('autoresize');
      };
      $scope.resetValues();

      function validate() {
        if (!/([^\s])/.test($scope.jobName) || !/([^\s])/.test($scope.description) || !/([^\s])/.test($scope.positions) || !/([^\s])/.test($scope.contactEmail)) {
          Materialize.toast('All fields are required', 4000);
          return false;
        }
        if(!/([^\s])/.test($scope.startDate) || !/([^\s])/.test($scope.endDate) || !/([^\s])/.test($scope.deadline) || !/([^\s])/.test($scope.location)){
          Materialize.toast('All fields are required', 4000);
          return false;
        }
        if (new Date($scope.startDate) < new Date()){
          Materialize.toast('Start Date should be greater than today.', 4000);
        }
        if (new Date($scope.startDate) > new Date($scope.endDate)){
          Materialize.toast('Start Date should be lower than End Date', 4000);
          return false;
        }
        if (new Date($scope.deadline) > new Date($scope.startDate)){
          Materialize.toast('Deadline should be lower than Start Date.', 4000);
          return false;
        }
        return true;
      }

      self.createJob = function() {
        validate();
        // if (validate()) {
        //   postingRef.push({
        //     "jobName": $scope.jobName,
        //     "description": $scope.description,
        //     "contactEmail": $scope.contactEmail,
        //     "location": $scope.location,
        //     "startDate": new Date($scope.startDate),
        //     "endDate": new Date($scope.endDate),
        //     "postedBy": authData.password.email,
        //     "positions": $scope.positions,
        //     "deadline": new Date($scope.deadline),
        //     "postedOn": new Date(Firebase.ServerValue.TIMESTAMP)
        //   }, function(error) {
        //     if (error) {
        //       Materialize.toast('Could not create Job. Please try again later.', 4000);
        //     } else {
        //       Materialize.toast('Job Created', 4000);
        //       $scope.resetValues();
        //     }
        //   });
        // }
      };

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

    }]);
})();
