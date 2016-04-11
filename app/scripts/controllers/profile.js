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

      $scope.initMaterial = function() {
          $(".button-collapse").sideNav({
            closeOnClick: $(window).width() > 991 ? false : true
          });
          $('select').material_select();
      };
      $scope.initMaterial();

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


      $scope.logout = function() {
        console.log('logout called');
        ref.unauth();
        console.log('logged out');
        $location.path('/');
      };

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
