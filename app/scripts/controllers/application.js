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
    .controller('ApplicationCtrl', ['$scope', '$location', '$routeParams', '$window', '$rootScope',
      function($scope, $location, $routeParams, $window, $rootScope) {
        var ref = new Firebase('https://sfip.firebaseio.com/');
        var postingRef = new Firebase('https://sfip.firebaseio.com/postings');
        var authData = ref.getAuth();
        var jobId = $routeParams.jobId;
        var job = {};

        $scope.loading = true;

        if (authData && jobId) {
          console.log("Authenticated user with uid:", authData.uid);
        } else {
          $location.path('/');
        }

        if ($rootScope.userType === true) {
          $location.path('/faculty');
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

        $scope.logout = function() {
          ref.unauth();
          $location.path('/');
        };

        function getData() {
          postingRef.orderByKey().equalTo(jobId).once('value', function(dataSnapshot) {
            job = dataSnapshot.val();
            console.log(job);
            for (var index in job) {
              $scope.jobName = job[index].jobName;
              break;
            }
            $scope.loading = false;
            $scope.$apply();
            $scope.loading = false;
          }, function(err) {
            console.error(err);
          });
        }
        getData();

        $scope.submitApplication = function() {
          console.log('submitApplication called');
          console.log(jobId);
          var applicationRef = new Firebase('https://sfip.firebaseio.com/applications');
          applicationRef.push({ //add server validation
            "appliedBy": authData.password.email,
            "contactEmail": $scope.contactEmail,
            "letter": $scope.letter,
            "attachment": $scope.attachment,
            "submittedOn": Firebase.ServerValue.TIMESTAMP,
            "jobId": jobId
          }, function(error) {
            if (error) {
              Materialize.toast('Server error. Try again later', 4000);
              $window.history.back();
              $scope.$apply();
            } else {
              Materialize.toast('Application Submitted', 4000);
              $window.history.back();
              $scope.$apply();
            }
          });
        };


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

      }
    ]);
})();
