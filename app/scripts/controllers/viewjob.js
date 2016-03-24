(function() {
  'use strict';
  /**
   * @ngdoc function
   * @name daiictSenTeam13App.controller:ViewjobCtrl
   * @description
   * # ViewjobCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('ViewjobCtrl', ['$scope', '$location', '$routeParams', function($scope, $location, $routeParams) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var applicationRef = new Firebase('https://sfip.firebaseio.com/application');
      var authData = ref.getAuth();
      var jobId = $routeParams.jobId;

      if (authData && jobId) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }

      function getData() {
        console.log('getData called');
        applicationRef.orderByChild('jobId').equalTo(jobId).on('value', function(dataSnapshot) {
          $scope.applications = dataSnapshot.val();
          console.log(dataSnapshot.val());
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

    }]);
})();
