(function() {
  'use strict';
  /**
   * @ngdoc controller
   * @name daiictSenTeam13App.controller:ApplicationCtrl
   * @description
   * # ApplicationCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('ApplicationCtrl', ['$scope', '$location', '$routeParams', '$window', '$rootScope', '$timeout',
      function($scope, $location, $routeParams, $window, $rootScope, $timeout) {
        var ref = new Firebase('https://sfip.firebaseio.com/');
        var authData = ref.getAuth();
        var jobId = $routeParams.jobId;
        var jobName = $routeParams.jobName;
        var job = {};

        $scope.loading = true;
        $scope.jobName = '';
        $scope.letter = '';
        $scope.contactEmail = '';
        $scope.attachment = '';

        if (authData && jobId && jobName) {
          console.log("Authenticated user with uid:", authData.uid);
        } else {
          $location.path('/');
        }

        if ($rootScope.userType === true) {
          $location.path('/faculty');
        }

        $scope.initMaterial = function() {
          $(document).ready(function() {
            $(".button-collapse").sideNav({
              closeOnClick: true
            });
            $('.modal-trigger').leanModal();
          });
        };
        $scope.initMaterial();

        $scope.resetValues = function() {
          document.getElementById("applicationForm").reset();
          $('#letter').trigger('autoresize');
        };
        $scope.resetValues();

        $scope.logout = function() {
          ref.unauth();
          $location.path('/');
        };

        function getData() {
          ref.child('postings').orderByKey().equalTo(jobId).once('value', function(dataSnapshot) {
            job = dataSnapshot.val();
            console.log(job);
            for (var index in job) {
              $scope.jobName = job[index].jobName;
              break;
            }
            $scope.loading = false;
            $timeout(function() {
              $scope.$apply();
            });
            $scope.loading = false;
          }, function(err) {
            console.error(err);
          });
        }
        getData();

        function validate() {
          if (!/([^\s])/.test($scope.letter) || !/([^\s])/.test($scope.contactEmail)) {
            Materialize.toast('All fields are required', 4000);
            return false;
          }
          return true;
        }

        $scope.submitApplication = function() {
          if (validate()) {
            ref.child('applications').push({ //add server validation
              "appliedBy": authData.password.email,
              "contactEmail": $scope.contactEmail,
              "letter": $scope.letter,
              "attachment": $scope.attachment,
              "submittedOn": Firebase.ServerValue.TIMESTAMP,
              "jobId": jobId,
              "jobName": jobName
            }, function(error) {
              if (error) {
                Materialize.toast('Server error. Try again later', 4000);
                $window.history.back();
                $timeout(function() {
                  $scope.$apply();
                });
              } else {
                Materialize.toast('Application Submitted', 4000);
                $window.history.back();
                $timeout(function() {
                  $scope.$apply();
                });
              }
            });
          }
        };

        $scope.goTo = function(page) {
          switch (page) {
            case 'home':
              if ($rootScope.userType === true) {
                $location.path('/faculty');
              } else {
                $location.path('/student');
              }
              break;
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
