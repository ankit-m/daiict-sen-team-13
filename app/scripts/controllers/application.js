(function() {
  'use strict';
  //TODO: date UTC format
  /**
   * @ngdoc function
   * @name daiictSenTeam13App.controller:ApplicationCtrl
   * @description
   * # ApplicationCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('ApplicationCtrl', ['$scope', '$location', '$routeParams', function($scope, $location, $routeParams) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var postingRef = new Firebase('https://sfip.firebaseio.com/postings');
      var authData = ref.getAuth();
      var jobId = $routeParams.jobId;
      var job = {};

      if (authData && jobId) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }

      $scope.initMaterial = function() {
        $('.modal-trigger').leanModal();
      };
      $scope.initMaterial();

      $scope.resetValues = function() {
        $scope.jobName = '';
        $scope.letter = '';
        $scope.contactEmail = '';
        $scope.attachment = '';
      };
      $scope.resetValues();

      function getData() {
        postingRef.orderByKey().equalTo(jobId).once('value', function(dataSnapshot) {
          job = dataSnapshot.val();
          console.log(job);
          for (var index in job) {
            $scope.jobName = job[index].jobName;
            break;
          }
          $scope.$apply();
        }, function(err) {
          console.error(err);
        });
      }
      getData();

      $scope.submitApplication = function() {
        console.log('submitApplication called');
        console.log(jobId);
        var applicationRef = new Firebase('https://sfip.firebaseio.com/application');
        applicationRef.push({
          "jobId": jobId,
          "appliedBy": authData.password.email,
          "contactEmail": $scope.contactEmail,
          "letter": $scope.letter,
          "attachment": $scope.attachment
        }, function(error) {
          if (error) {
            console.error('Could not complete the application');
          } else {
            console.log('Applied');
          }
        });
      };

    }]);
})();
