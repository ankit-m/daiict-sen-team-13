(function() {
  'use strict';
  /**
   * @ngdoc function
   * @name daiictSenTeam13App.controller:StudentCtrl
   * @description
   * # StudentCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('StudentCtrl', ['$scope', '$location', function($scope, $location) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var postingRef = new Firebase('https://sfip.firebaseio.com/postings');
      var authData = ref.getAuth();

      $scope.jobs = {};

      if (authData) {
        console.log("Authenticated user with uid:", authData);
      } else {
        $location.path('/');
      }

      function getData() {
        console.log('getData called');
        postingRef.limitToFirst(4).once('value', function(dataSnapshot) {
          $scope.jobs = dataSnapshot.val();
          console.log($scope.jobs);
          $scope.$apply();
        }, function(err) {
          console.error(err);
        });
        console.log('getData return');
      }
      getData();

      $scope.initMaterial = function() {
        $(document).ready(function() {
          $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
          });
        });
        $(".button-collapse").sideNav();
      };
      $scope.initMaterial();

      $scope.logout = function() {
        console.log('logout called');
        ref.unauth();
        console.log('logged out');
        $location.path('/');
      };

      $scope.applyForJob = function(jobId) {
        console.log('applyForJob called');
        // console.log('/application?jobId=' + encodeURIComponent(jobId));
        $location.path('/application').search({'jobId': jobId});
        console.log('applyForJob return');
      };

    }]);
})();
