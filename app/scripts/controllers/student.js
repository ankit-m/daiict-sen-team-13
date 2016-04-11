(function() {
  'use strict';
  /**
   * @ngdoc controller
   * @name daiictSenTeam13App.controller:StudentCtrl
   * @description
   * # StudentCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('StudentCtrl', ['$scope', '$location', '$timeout', '$rootScope', function($scope, $location, $timeout, $rootScope) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();
      var self = this;

      $scope.jobs = {};
      $scope.chatRooms = {};
      $scope.loading = true;
      $location.url($location.path());

      if (authData) {
        console.log("Authenticated user with uid:", authData);
      } else {
        $location.path('/');
      }

      if ($rootScope.userType === true) {
        $location.path('/faculty');
      }

      function getData() {
        $scope.loading = true;
        ref.child('postings').limitToFirst(4).once('value', function(dataSnapshot) {
          $scope.jobs = dataSnapshot.val();
          $timeout(function() {
            $scope.$apply();
          });
        }, function(err) {
          console.error(err);
        });

        ref.child('chatRooms').limitToFirst(4).once('value', function(dataSnapshot) {
          $scope.chatRooms = dataSnapshot.val();
          $timeout(function() {
            $scope.$apply();
          });
        }, function(err) {
          console.error(err);
        });

        ref.child('applications').orderByChild('appliedBy').equalTo(authData.password.email).on('value', function(dataSnapshot) {
          $scope.applications = dataSnapshot.val();
          $timeout(function() {
            $scope.$apply();
          });
          $scope.loading = false;
        }, function(err) {
          console.error(err);
        });
      }
      getData();

      $scope.initMaterial = function() {
        $(document).ready(function() {
          $(".button-collapse").sideNav({
            'closeOnClick': $(window).width() > 991 ? false : true
          });
          $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
          });
        });
      };
      $scope.initMaterial();

      $scope.goTo = function(page) {
        switch (page) {
          case 'home':
            $location.path('/student');
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

      $scope.logout = function() {
        ref.unauth();
        $location.path('/');
      };

      self.applyForJob = function(jobId, jobName) {
        ref.child('applications').orderByChild('appliedBy').equalTo(authData.password.email).once('value', function(data) {
          var applied = false;
          for (var application in data.val()) {
            if (data.val()[application].jobId === jobId) {
              applied = true;
              Materialize.toast('You have already applied.', 4000);
            }
          }
          if (applied === false) {
            $location.path('/application').search({
              'jobId': jobId,
              'jobName': jobName
            });
          }
        });

      };

      function validate(members, chatRoom) {
        for (var member in members) {
          if (member.emailId === authData.password.email) {
            return false;
          }
        }
        if (chatRoom.slots > 0) {
          var currentDate = new Date();
          var currentTime = String(currentDate.getHours()) + ':' + String(currentDate.getMinutes());
          if (currentTime > chatRoom.startTime) {
            var today = new Date();
            var weekday = new Array(7);
            weekday[0] = "Sunday";
            weekday[1] = "Monday";
            weekday[2] = "Tuesday";
            weekday[3] = "Wednesday";
            weekday[4] = "Thursday";
            weekday[5] = "Friday";
            weekday[6] = "Saturday";
            if (weekday[today.getDay()] === chatRoom.days) {
              return true;
            } else {
              Materialize.toast('Wrong Day. Chat room not open.', 4000);
              return false;
            }
          } else {
            Materialize.toast('Chat room not open yet. Try again later', 4000);
            return false;
          }
        } else {
          Materialize.toast('Chat room full. Please try again later', 4000);
          return false;
        }
        return true;
      }


      self.openChatRoom = function(key, chatRoom) {
        $scope.loading = true;
        ref.child('chatRooms').child(key).once('value', function(dataSnapshot) {
          if (validate(dataSnapshot.val().members, chatRoom)) {
            ref.child('chatRooms').child(key).child('members').push({
              'emailId': authData.password.email,
              'kicked': 0,
              'active': 1
            }, function(error) {
              if (error) {
                console.log(error);
                $scope.loading = false;
              } else {
                ref.child('chatRooms').child(key).child('slots').transaction(function(remainingSlots) {
                  if (remainingSlots === 0) {
                    return;
                  }
                  return remainingSlots - 1;
                }, function(error, committed) {
                  if (error) {
                    //server error
                  } else if (!committed) {
                    //slots taken
                    //rollback
                  } else {
                    $location.path('/chat').search({
                      'roomId': key
                    });
                    $timeout(function() {
                      $scope.$apply();
                    });
                  }
                });
              }
            });
          }
        });
        $scope.loading = false;
      };

    }]);
})();
