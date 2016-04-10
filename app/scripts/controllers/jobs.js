(function() {
  'use strict';
  //TODO: date UTC format
  /**
   * @ngdoc function
   * @name daiictSenTeam13App.controller:JobsCtrl
   * @description
   * # JobsCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('JobsCtrl', ['$scope', '$location', '$rootScope', function($scope, $location, $rootScope) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var postingRef = new Firebase('https://sfip.firebaseio.com/postings');
      var authData = ref.getAuth();
      var self = this;

      $scope.loading = true;
      $scope.jobPostings = {};

      $scope.initCollapsible = function() {
        $(document).ready(function() {
          $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
          });
        });
      };
      $scope.initCollapsible();

      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }

      postingRef.once('value', function(dataSnapshot) {
        $scope.jobPostings = dataSnapshot.val();
        console.log($scope.jobPostings);
        $scope.loading = false;
        $scope.$apply();

      }, function(err) {
        console.error(err);
      });

      $scope.goTo = function(page) {
        switch (page) {
          case 'profile':
            $location.path('/profile');
            break;
          case 'chatRooms':
            if ($rootScope.userType === true) {
              $location.path('/createChat');
            } else {
              $location.path('/chatRooms');
            }
            break;
          case 'jobs':
            if ($rootScope.userType === true) {
              $location.path('/posting');
            } else {
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

      self.logout = function() {
        console.log('logout called');
        ref.unauth();
        console.log('logged out');
        $location.path('/');
      };

      self.applyForJob = function(jobId) {
        $location.path('/application').search({
          'jobId': jobId
        });
      };

    }]);


    
  angular.module('daiictSenTeam13App').filter('customJobList', function() {
  return function(input, search) {
    if (!input) return input;
    if (!search) return input;
    var expected = ('' + search).toLowerCase();
    var result = {};
    angular.forEach(input, function(value,key) {
      var actual = ('' + value.jobName).toLowerCase();
      var actual2 = ('' + value.description).toLowerCase();
      var actual3 = ('' + value.location).toLowerCase();
      var actual4 = ('' + value.postedBy).toLowerCase();
      if (actual.indexOf(expected) !== -1 || actual2.indexOf(expected) !== -1 || actual3.indexOf(expected) !== -1 || actual4.indexOf(expected) !== -1 ) {
        result[key] = value;
      }
    });
    return result;
  }
});

})();
