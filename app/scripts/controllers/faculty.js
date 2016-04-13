(function() {
  'use strict';
  /**
   * @ngdoc controller
   * @name daiictSenTeam13App.controller:FacultyCtrl
   * @description
   * # StudentCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('FacultyCtrl', ['$scope', '$location', '$rootScope', '$timeout', function($scope, $location, $rootScope, $timeout) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();
      var self = this;
      var postingRef = new Firebase('https://sfip.firebaseio.com/postings');

      $scope.loading = true;
      $scope.chatRooms = {};
      $location.url($location.path());

      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }

      if ($rootScope.userType === false) {
        $location.path('/student');
      }

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:FacultyCtrl#getData
       * @methodOf daiictSenTeam13App.controller:FacultyCtrl
       * @description
       * Gets a list of all the jobs and chat rooms that were created by the
       * faculty user. Function is called when faculty.html view is loaded. The
       * list of chatRoom objects and createdJobs objects are stored as scope
       * variables so that they can be used in the view for displaying.
       * @returns {undefined} Does not return anything.
       */
      function getData() {
        $scope.loading = true;
        postingRef.orderByChild('postedBy').equalTo(authData.password.email).on('value', function(dataSnapshot) {
          $scope.createdJobs = dataSnapshot.val();
          console.log($scope.createdJobs);
        }, function(err) {
          console.error(err);
        });

        ref.child('chatRooms').orderByChild('createdBy').equalTo(authData.password.email).on('value', function(dataSnapshot) {
          $scope.chatRooms = dataSnapshot.val();
          console.log($scope.chatRooms);
          $timeout(function() {
            $scope.$apply();
          });
          $scope.loading = false;
        });
      }
      getData();

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:FacultyCtrl#initMaterial
       * @methodOf daiictSenTeam13App.controller:FacultyCtrl
       * @description
       * Initialises the Matrialise modules.
       * @returns {undefined} Does not return anything.
       */
      $scope.initMaterial = function() {
        $(document).ready(function() {
          $(".button-collapse").sideNav({
            closeOnClick: $(window).width() > 991 ? false : true
          });
          $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
          });
        });
      };
      $scope.initMaterial();

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:FacultyCtrl#goTo
       * @methodOf daiictSenTeam13App.controller:FacultyCtrl
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
            $location.path('/faculty');
            break;
          case 'profile':
            $location.path('/profile');
            break;
          case 'chatRooms':
            $location.path('/createChat');
            break;
          case 'jobs':
            $location.path('/posting');
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
       * @name daiictSenTeam13App.controller:FacultyCtrl#logout
       * @methodOf daiictSenTeam13App.controller:FacultyCtrl
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
       * @name daiictSenTeam13App.controller:FacultyCtrl#showAllChatRooms
       * @methodOf daiictSenTeam13App.controller:FacultyCtrl
       * @description
       * Function called when user clicks on show all chat rooms button on the
       * controller's view. The user is redirected to the route /chatRooms.
       * @returns {undefined} Does not return anything.
       */
      self.showAllChatRooms = function() {
        $location.path('/chatRooms');
      };


      function validate(members) {
        for (var member in members) {
          if (member.emailId === authData.password.email) {
            return false;
          }
        }
        return true;
      }

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:FacultyCtrl#openChatRoom
       * @methodOf daiictSenTeam13App.controller:FacultyCtrl
       * @param {string} key Unique key in the database to identify
       * the chat room which faculty is trying to open
       * @description
       * This function gets called when faculty tries to join some chat room
       * from the list of chat rooms displayed on his '/faculty page'. The list
       * that is displayed is the list of chat rooms created by him.  The
       * faculty user is added to the list of active members of the corresponding
       * chat room and is redirected to that chat room.
       * @returns {undefined} Does not return anything.
       */
      self.openChatRoom = function(key) {
        ref.child('chatRooms').child(key).once('value', function(dataSnapshot) {
          if (validate(dataSnapshot.val().members)) {
            ref.child('chatRooms').child(key).child('members').push({
              'emailId': authData.password.email,
              'kicked': 0,
              'active': 1
            }, function(error) {
              if (error) {
                console.log(error);
              } else {
                ref.child('chatRooms').child(key).update({
                  active: true
                }, function(error) {
                  if (error) {
                    console.log(error);
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
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:FacultyCtrl#deleteChatRoom
       * @methodOf daiictSenTeam13App.controller:FacultyCtrl
       * @param {string} chatRoomId Unique id which identifies a chat room
       * object entry in the database corresponding to the chatRoom which
       * user is trying to delete.
       * @description
       * This function is called when user clicks on delete chat room on any
       * one of the chat room from the list of chat rooms that have been
       * created by him. The chat room on which the user has clicked is identified
       * by the unique chat room key that is passed from the view to the function.
       * The corresponding database entry for thr chat room
       * is deleted so that that particualr room doesn't exist anymore. On
       * successful deletion from database, a toast is displayed with the
       * message "Deleted Chat Room". On error, the user is informed that
       * the corresponding chat room hasn;t been deleted and is prompted to
       * try later.
       * @returns {undefined} Does not return anything.
       */
      self.deleteChatRoom = function(chatRoomId) {
        ref.child('chatRooms').child(chatRoomId).remove(function(error) {
          if (error) {
            Materialize.toast('Could not Delete Chat Room. Try later', 4000);
          } else {
            Materialize.toast('Deleted Chat Room', 4000);
            $timeout(function() {
              $scope.$apply();
            });
          }
        });
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:FacultyCtrl#showAllJobs
       * @methodOf daiictSenTeam13App.controller:FacultyCtrl
       * @description
       * This function is called when faculty clicks on show all jobs option
       * on his page i.e. /faculty. It redirects the user to the '/jobs' page
       * where the controller will display a list of all active jobs in th database.
       * @returns {undefined} Does not return anything.
       */
      $scope.showAllJobs = function() {
        $location.path('/jobs');
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:FacultyCtrl#viewJob
       * @methodOf daiictSenTeam13App.controller:FacultyCtrl
       * @param {string} jobId Unique id which identifies a job
       * object entry in the database corresponding to the job which
       * faculty is trying to view.
       * @description
       * This function is called when faculty clicks on any one of
       * the job in the list of jobs created by him. It takes in as input the
       * unique key for a job in the database i.e. the jobId and redirects the
       * user to the /viewJob page with the jobId given as a route parameter
       * to the route that is being called. The viewJob page will display all
       * applications for the job, list of accepted and rejected applications.
       * @returns {undefined} Does not return anything.
       */
      self.viewJob = function(jobId) {
        console.log(jobId);
        $location.path('/viewJob').search({
          'jobId': jobId
        });
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:FacultyCtrl#deleteJob
       * @methodOf daiictSenTeam13App.controller:FacultyCtrl
       * @param {string} jobId Unique id which identifies a job
       * object entry in the database corresponding to the job which
       * faculty is trying to view.
       * @description
       * This function is called when user clicks on delete job on any
       * one of the jobs from the list of jobs that have been
       * created by him. The job on which the user has clicked is identified
       * by the unique jobId that is passed from the view to the function.
       * The corresponding database entry for the job
       * is deleted so that that particualr job doesn't exist anymore. On
       * successful deletion from database, a toast is displayed with the
       * message "Deleted Job". On error, the user is informed that
       * the corresponding job hasn't been deleted and is prompted to
       * try later.
       * @returns {undefined} Does not return anything.
       */
      self.deleteJob = function(jobId) { //atomize this request
        ref.child('postings').child(jobId).remove(function(error) {
          if (error) {
            Materialize.toast('Could not Delete Job. Try later', 4000);
          }
        });
        ref.child('application').child(jobId).remove(function(error) {
          if (error) {
            Materialize.toast('Could not Delete Job. Try later', 4000);
          } else {
            Materialize.toast('Deleted Job', 4000);
          }
        });
      };

    }]);
})();
