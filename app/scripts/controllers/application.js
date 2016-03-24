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

      $scope.jobName = '';

      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }

      function getData(){
        postingRef.orderByKey().equalTo(jobId).once('value', function(dataSnapshot) {
          job = dataSnapshot.val();
          console.log(job);
          $scope.$apply();
        }, function(err) {
          console.error(err);
        });
      }
      getData();

    }]);
})();
