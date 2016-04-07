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
    .controller('PostingCtrl', ['$scope', '$location', '$timeout', function($scope, $location, $timeout) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var postingRef = new Firebase('https://sfip.firebaseio.com/postings');
      var authData = ref.getAuth();
      var self = this;

      $scope.loading = true;
      // $location.search('jobId', null);

      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
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
        //reset form
        $scope.jobName = '';
        $scope.description = '';
        $scope.contactEmail = '';
        $scope.location = '';
        $scope.startDate = '';
        $scope.endDate = '';
        $scope.positions = '';
        $timeout(function() {
          $scope.$apply();
        });

      };
      $scope.resetValues();

      function validate() {
        // var tempDate = new Date($scope.deadline);
        // $scope.deadline = tempDate;
        // console.log(tempDate);
      }

      self.createJob = function() {
        validate();
        console.log('createJob called');
        postingRef.push({
          "jobName": $scope.jobName,
          "description": $scope.description,
          "contactEmail": $scope.contactEmail,
          "location": $scope.location,
          "startDate": Date($scope.startDate),
          "endDate": Date($scope.endDate),
          "postedBy": authData.password.email,
          "positions": $scope.positions,
          "deadline": Date($scope.deadline),
          "postedOn": Date(Firebase.ServerValue.TIMESTAMP)
        }, function(error) {
          if (error) {
            Materialize.toast('Could not create Job', 4000);
          } else {
            Materialize.toast('Job Created', 4000);
            $scope.resetValues();
            console.log('Created Job');
          }
        });
        console.log('createJob return');
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

    }]);
})();
