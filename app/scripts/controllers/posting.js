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
      $scope.loading=true;

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
          $scope.loading=false;
        }, function(err) {
          console.error(err);
        });

        console.log('getData return');
      }
      getData();

      $scope.resetValues = function() {
        $scope.jobName = '';
        $scope.description = '';
        $scope.contactEmail = '';
        $scope.location = '';
        $scope.startDate = '';
        $scope.endDate = '';
        $timeout(function() {
          $scope.$apply();
        });

      };
      $scope.resetValues();

      self.createJob = function() {
        console.log('createJob called');
        postingRef.push({
          "jobName": $scope.jobName,
          "description": $scope.description,
          "contactEmail": $scope.contactEmail,
          "location": $scope.location,
          "startDate": $scope.startDate,
          "endDate": $scope.endDate,
          "postedBy": authData.password.email
        }, function(error) {
          if (error) {
            console.error('Could not create Job');
          } else {
            Materialize.toast('Job Created', 4000);
            $scope.resetValues();
            console.log('Created Job');
          }
        });
        console.log('createJob return');
      };

      self.showAll = function(){
        $location.path('/jobs');
      };

      self.viewJob = function(jobId) {
        console.log(jobId);
        $location.path('/viewJob').search({
          'jobId': jobId
        });
      };

      self.deleteJob = function(jobId){ //atomize this request
        console.log('delete job');
        ref.child('postings').child(jobId).remove(function(error){
          if(error){
            Materialize.toast('Could not Delete Job. Try later', 4000);
          }
        });
        ref.child('application').child(jobId).remove(function(error){
          if(error){
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
            if(authData.password.email.charAt(4)==="1"){
               $location.path('/createChat');
            }
            else {
              $location.path('/chatRooms');
            }
            
            break;
          case 'jobs':
            if(authData.password.email.charAt(4)==="1"){
               $location.path('/posting');
            }
            else {
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
