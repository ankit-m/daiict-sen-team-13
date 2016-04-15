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

      $scope.jobs = {};
      $scope.chatRooms = {};
      $scope.loading = true;
      $location.url($location.path());
      $rootScope.userType = sessionStorage.getItem('userType');

      if (authData) {
        console.log("Authenticated user with uid:", authData);
      } else {
        $location.path('/');
      }
      console.log($rootScope.userType);
      if ($rootScope.userType === 'true') {
        $location.path('/faculty');
      }

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:StudentCtrl#getData
       * @methodOf daiictSenTeam13App.controller:StudentCtrl
       * @description
       * Gets a list of the first four jobs, chat rooms and a list of all applications that the
       * student has submitted for active jobs. Function is called on '/student' page view load. The
       * Function is called on '/student' page view load. The chatRoom object, jobs object and
       * applications object are stored in their own scope variables variables so that they can be
       * used in the view for displaying.
       *
       * @returns {undefined} Does not return anything.
       */
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
          console.log($scope.chatRooms);
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

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:StudentCtrl#initMaterial
       * @methodOf daiictSenTeam13App.controller:StudentCtrl
       * @description
       * Initialises the Matrialise modules.
       * @returns {undefined} Does not return anything.
       */
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

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:StudentCtrl#goTo
       * @methodOf daiictSenTeam13App.controller:StudentCtrl
       * @param {string} page String that is passed according to
       * the option clicked by the user in the navigation drawer
       * displayed to the left of the screen. 'profile' if the
       * profile option was clicked, 'chatRooms' if the chat rooms
       * option was clicked etc.
       * @description
       * This function is used to redirect the user to either of
       * the 4 pages, that are profile page, chatRooms page,
       * jobs page or people page, based on what he/she has
       * clicked on in the navigation bar displayed in the left
       * of the screen. Note the following
       * 1. A professor is redirected to '/createChat' on clicking
       * "Chat Rooms" in the nav bar whereas a student is redirected
       * to '/chatRooms'.
       * 2. A professor is redirected to '/posting' on clicking
       * 'Jobs' whereas a student is redirected to '/jobs'.
       * @returns {undefined} Does not return anything.
       */
      $scope.goTo = function(page) {
        switch (page) {
          case 'home':
            $location.path('/student');
            break;
          case 'profile':
            $location.path('/profile');
            break;
          case 'chatRooms':
              $location.path('/chatRooms');
            break;
          case 'jobs':
              $location.path('/jobs');
            break;
          case 'people':
            $location.path('/people');
            break;
          default:
            $location.path('/');
        }
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:StudentCtrl#logout
       * @methodOf daiictSenTeam13App.controller:StudentCtrl
       * @description
       * Ends the user's session and logs him out.
       * @returns {undefined} Does not return anything.
       */
      $scope.logout = function() {
        ref.unauth();
        $location.path('/');
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:StudentCtrl#applyForJob
       * @methodOf daiictSenTeam13App.controller:StudentCtrl
       * @param {string} jobId Unique id which identifies a job
       * object entry in the database corresponding to the job which
       * student is trying to apply for.
       * @param {string} jobName Name of the job as stored in the database
       * for which student is trying to apply.
       * @description
       * This function is called when a student clicks on apply job for any
       * of the job from the job list displayed on the '/student' view. It takes
       * in as input the jobId and the jobName of that job. It then checks whether
       * the given student has already applied for the given job. If that is the
       * case, a toast message is displayed saying "You've already applied for this
       * job." If the student hasn't previously applied for the job, he is redirected
       * to the /application view where he can upload his resume, statament of purpose.
       * jobId and jobName arr the route parameters passed to /application page.
       *
       * @returns {undefined} Does not return anything.
       */
      $scope.applyForJob = function(jobId, jobName) {
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

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ChatroomsCtrl#validate
       * @methodOf daiictSenTeam13App.controller:ChatroomsCtrl
       * @param {object} chatRoom chatRoom object which contains data
       * corresponding to the chatRoom which user is trying to join
       * @description
       * This function is a validating function called when a user
       * tries to enter a chat room. The function takes in as inputs
       * the chatroom object corresponding to the chat room which the
       * user tries to enter. Validation checks if the chatRoom is active
       * or not.
       * @returns {boolean} Data is valid or not
       */
       $scope.validate = function(members, chatRoom) {
        for (var member in members) {
          if (chatRoom.members[member].emailId === authData.password.email) {
            return false;
          }
        }
        if (chatRoom.active === false) {
          Materialize.toast('Chat Room not open. Try again later.', 4000);
          return false;
        } else {
          if (chatRoom.slots > 0) {
            return true;
          }
          Materialize.toast('Chat room full. Please try again later', 4000);
          return false;
        }
        return true;
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:StudentCtrl#openChatRoom
       * @methodOf daiictSenTeam13App.controller:StudentCtrl
       * @param {string} key Unique key in the database to identify
       * the chat room which user is trying to join
       * @param {object} chatRoom chatRoom object which contains data
       * corresponding to the chatRoom which user is trying to join
       * @description
       * This function gets called when a student tries to join some chat room
       * from the list of chat rooms displayed on the /student page. First, the
       * user is validated according to the validate function described on this page.
       * If validate function returns true, the student is added to the list of active members
       * of the corresponding chat room. Databse transactions mechanism is used to
       * ensure that even if two members who may have been validated by the validate
       * function due to delay in database updations because of the network, they do not
       * both join the chat room if only one slot is left.
       * @returns {undefined} Does not return anything.
       */
      $scope.openChatRoom = function(key, chatRoom) {
        $scope.loading = true;
        ref.child('chatRooms').child(key).once('value', function(dataSnapshot) {
          if ($scope.validate(dataSnapshot.val().members, chatRoom)) {
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

      $scope.viewProfile = function(email) {
        $location.path('/viewProfile').search({
          'profileId': email
        });
      };

    }]);
})();
