(function() {
  'use strict';
  /**
   * @ngdoc controller
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

      
      $scope.initMaterial = function() {
        $(document).ready(function() {
          $(".button-collapse").sideNav();
        });
      };
      $scope.initMaterial();

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:PeopleCtrl#goTo
       * @methodOf daiictSenTeam13App.controller:PeopleCtrl
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

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:PeopleCtrl#getData
       * @methodOf daiictSenTeam13App.controller:PeopleCtrl
       * @description
       * Gets a list of all registered users on the portal. Function is called on 
       * '/people' page view load. The people object is stored in a scope
       * variables variable so that it can be used in the view for displaying
       * all registered users.
       * @returns {undefined} Does not return anything.
       */
      function getPeopleData() {
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
      getPeopleData();

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:PeopleCtrl#viewProfile
       * @methodOf daiictSenTeam13App.controller:PeopleCtrl
       * @param {String} email It is the email address of the user whose profile 
       * the logged in user wants to view.
       * @description
       * This function gets called when a logged in user clicks on view
       * profile for any of the users who is in the "people" list. It takes
       * in the email address of the user whose profile the logged in user
       * wants to view.The argument is passed as the route parameter when the function 
       * redirects the user to the profile page he wishes to view.   
       * @returns {undefined} Does not return anything.
       */
      self.viewProfile = function(email) {
        $location.path('/viewProfile').search({
          'profileId': email
        });
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:PeopleCtrl#logout
       * @methodOf daiictSenTeam13App.controller:PeopleCtrl
       * @description
       * Ends the user's session and logs him out. 
       * @returns {undefined} Does not return anything.
       */
      self.logout = function() {
        ref.unauth();
        $location.path('/');
      };


    }]);
})();
