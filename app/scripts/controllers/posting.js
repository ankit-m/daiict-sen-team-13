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
    .controller('PostingCtrl', ['$scope', '$location', function($scope, $location) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var postingRef = new Firebase('https://sfip.firebaseio.com/postings');
      var authData = ref.getAuth();

      $scope.resetValues = function() {
        $scope.jobName = '';
        $scope.description = '';
        $scope.contactEmail = '';
        $scope.location = '';
        $scope.startDate = '';
        $scope.endDate = '';
      };
      $scope.resetValues();

      $scope.createJob = function() {
        console.log('createJob called');
        postingRef.push({
          "jobName": $scope.jobName,
          "description": $scope.description,
          "contactEmail": $scope.contactEmail,
          "location": $scope.location,
          "startDate": $scope.startDate,
          "endDate": $scope.endDate
        }, function(error) {
          if (error) {
            console.error('Could not create Job');
          } else {
            console.log('Created Job');
          }
        });
        console.log('createJob return');
      };

    }]);
})();
