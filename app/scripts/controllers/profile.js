(function() {
  'use strict';
  /**
   * @ngdoc controller
   * @name daiictSenTeam13App.controller:ProfileCtrl
   * @description
   * # ProfileCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('ProfileCtrl', ['$scope', '$location', '$timeout', '$rootScope', function($scope, $location, $timeout, $rootScope) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();
      var profileKey = '';
      var self = this;

      $scope.loading = true;
      $location.url($location.path());

      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }

      /**
      * @ngdoc function
      * @name daiictSenTeam13App.controller:ProfileCtrl#initMaterial
      * @methodOf daiictSenTeam13App.controller:ProfileCtrl
      * @description
      * Initialises the Matrialise modules.
      * @returns {undefined} Does not return anything.
      */
      $scope.initMaterial = function() {
          $(".button-collapse").sideNav({
            'closeOnClick': $(window).width() > 991 ? false : true
          });
          $('select').material_select();
      };
      $scope.initMaterial();

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ProfileCtrl#getData
       * @methodOf daiictSenTeam13App.controller:ProfileCtrl
       * @description
       * Function is called when /profile page is loaded. It retrieves all the profile data
       * of the logged in user from the database such as name, institute, interests, publications
       * etc. and stores them in scope variables so that they can be displayed in the /profile page view.
       * If data can't be retrieved, error message is logged.
       * @returns {undefined} Does not return anything.
       */
      function getData() {
        ref.child('profile').orderByChild('email').equalTo(authData.password.email).on('value', function(dataSnapshot) {
          console.log(dataSnapshot.val());
          var temp = dataSnapshot.val();
          for (var key in temp) {
            $scope.firstName = temp[key].firstName;
            $scope.lastName = temp[key].lastName;
            $scope.type = temp[key].type;
            $scope.institute = temp[key].institute;
            $scope.about = temp[key].about;
            $scope.interests = temp[key].interests;
            $scope.publications = temp[key].publications;
            $scope.location = temp[key].location;
            $scope.contact = temp[key].contact;
            profileKey = key;
            break;
          }
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
      * @name daiictSenTeam13App.controller:ProfileCtrl#logout
      * @methodOf daiictSenTeam13App.controller:ProfileCtrl
      * @description
      * Ends the user's session and logs him out.
      * @returns {undefined} Does not return anything.
      */
      $scope.logout = function() {
        console.log('logout called');
        ref.unauth();
        console.log('logged out');
        $location.path('/');
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ProfileCtrl#updateProfile
       * @methodOf daiictSenTeam13App.controller:ProfileCtrl
       * @param {string} type String argument passed when user updates any
       * profile information on his profile page.
       * @description This function is called when user edits any of the
       * fields in his profile page. Baswd on which field's information is
       * altered, a string is passed to this function from the view and the
       * corresponding switch case is triggered. For example: If user edits
       * his institute by changing text content in the institute text box
       * in the view, the 'institute' switch case is triggered and the
       * new institute is stored in the database for that user. If profile
       * information can't be updated, an error toast is displayed
       * @returns {undefined} Does not return anything.
       */
      self.updateProfile = function(type) {
        console.log('called', type);
        switch (type) {
          case 'institute':
            ref.child('profile').child(profileKey).update({
              institute: $scope.institute
            }, function(error) {
              if (error) {
                Materialize.toast('Could not update' + type, 4000);
              } else {
                Materialize.toast('Updated ' + type, 4000);
              }
            });
            break;
          case 'about':
            ref.child('profile').child(profileKey).update({
              about: $scope.about
            }, function(error) {
              if (error) {
                Materialize.toast('Could not update' + type, 4000);
              } else {
                Materialize.toast('Updated ' + type, 4000);
              }
            });
            break;
          case 'interest':
            ref.child('profile').child(profileKey).child('interests').push({
              interest: $scope.interest
            }, function(error) {
              if (error) {
                Materialize.toast('Could not add' + type, 4000);
              } else {
                $scope.interest = '';
                $timeout(function() {
                  $scope.$apply();
                });
                Materialize.toast('Added ' + type, 4000);
              }
            });
            break;
          case 'publication':
            ref.child('profile').child(profileKey).child('publications').push({
              publication: $scope.publication
            }, function(error) {
              if (error) {
                Materialize.toast('Could not add' + type, 4000);
              } else {
                $scope.publication = '';
                $timeout(function() {
                  $scope.$apply();
                });
                Materialize.toast('Added ' + type, 4000);
              }
            });
            break;
          case 'location':
            ref.child('profile').child(profileKey).update({
              location: $scope.location
            }, function(error) {
              if (error) {
                Materialize.toast('Could not update' + type, 4000);
              } else {
                Materialize.toast('Updated ' + type, 4000);
              }
            });
            break;
          case 'contact':
            ref.child('profile').child(profileKey).update({
              contact: $scope.contact
            }, function(error) {
              if (error) {
                Materialize.toast('Could not update' + type, 4000);
              } else {
                Materialize.toast('Updated ' + type, 4000);
              }
            });
            break;
          default:

        }
      };

      /**
       * @ngdoc function
       * @name daiictSenTeam13App.controller:ProfileCtrl#removeItem
       * @methodOf daiictSenTeam13App.controller:ProfileCtrl
       * @param {string} key Unique key in the database to identify th
       * interest/publication data that a user wished to delete from his
       * profile.
       * @param {string} Type of data that user wishes to delete. Takes value
       * of "interests" or "publications".
       * @description
       * Function removes an interest or publication from the user's
       * profile details. When user clicks on remove on a particular
       * interest or publication in his profile view, the corresponding
       * unique key for the interest/publication in thr database is passed in
       * to this function as well as the type i.e either interest/publication.
       * The function searches for thekey in the database and removes the data at
       * that location.
       * @returns {undefined} Does not return anything.
       */
      self.removeItem = function(key, type) {
        ref.child('profile').child(profileKey).child(type).child(key).remove();
      };


      self.viewHomePage = function() {
        if ($rootScope.userType === true) {
          $location.path('/faculty');
        } else {
          $location.path('/student');
        }
      };

      /**
      * @ngdoc function
      * @name daiictSenTeam13App.controller:ProfileCtrl#goTo
      * @methodOf daiictSenTeam13App.controller:ProfileCtrl
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

    }]);
})();
