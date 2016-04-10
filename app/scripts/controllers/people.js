(function() {
  'use strict';
  //TODO: date UTC format
  /**
   * @ngdoc function
   * @name daiictSenTeam13App.controller:PeopleCtrl
   * @description
   * # PeopleCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('PeopleCtrl', ['$scope', '$location', '$timeout', '$rootScope', function($scope, $location, $timeout, $rootScope) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();
      var self = this;

      $scope.jobs = {};
      $scope.allUsers = {};
      $scope.loading = true;



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

      function getData() {
        ref.child('profile').once('value', function(dataSnapshot) {
          $scope.allUsers = dataSnapshot.val();
          console.log($scope.allUsers);
          $scope.loading = false;
          $timeout(function() {
            $scope.$apply();
          });
        }, function(err) {
          if (err) {
            Materialize.toast('Could Not obtain Data', 4000);
            $location.path('/');
          }
        });
      }
      getData();

      self.viewProfile = function(email) {
        $location.path('/viewProfile').search({
          'profileId': email
        });
      };

      self.logout = function() {
        ref.unauth();
        $location.path('/');
      };


    }]);
  

   angular.module('daiictSenTeam13App').filter('customPeople', function() {
  return function(input, search) {
    if (!input) return input;
    if (!search) return input;
    var expected = ('' + search).toLowerCase();
    var result = {};
    angular.forEach(input, function(value,key) {
      //console.log("These are interests length",value.interests);
      var actual = ('' + value.firstName).toLowerCase();
      var actual2=('' + value.institute).toLowerCase();
      var actual3=('' + value.lastName).toLowerCase();
      var actual4=('' + value.email).toLowerCase();         
      //interests and publications?

      if (actual.indexOf(expected) !== -1 || actual2.indexOf(expected) !== -1 || actual3.indexOf(expected) !== -1 || actual4.indexOf(expected) !== -1  ) {
        result[key] = value;
      }
    });
    return result;
  }
});


})();
