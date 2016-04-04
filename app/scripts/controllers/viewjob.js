(function() {
  'use strict';
  /**
   * @ngdoc function
   * @name daiictSenTeam13App.controller:ViewjobCtrl
   * @description
   * # ViewjobCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('ViewjobCtrl', ['$scope', '$location', '$routeParams', function($scope, $location, $routeParams) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var applicationRef = new Firebase('https://sfip.firebaseio.com/application');
      var authData = ref.getAuth();
      var jobId = $routeParams.jobId;
      var self = this;
      $scope.loading=true;

      if (authData && jobId) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }

      function getData() {
        console.log('getData called');
        applicationRef.child(jobId).on('value', function(dataSnapshot) {
          $scope.applications = dataSnapshot.val();
          console.log(dataSnapshot.val());
          $scope.$apply();
        }, function(err) {
          console.error(err);
        });
        console.log('getData return');
        $scope.loading=false;  
      }
      getData();

      $scope.initMaterial = function() {
        $(document).ready(function() {
          $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
          });
        });
        $(".button-collapse").sideNav();
      };
      $scope.initMaterial();

      $scope.logout = function() {
        console.log('logout called');
        ref.unauth();
        console.log('logged out');
        $location.path('/');
      };

      self.acceptApplication = function(applicationId){
        console.log('accept');
        ref.child('application').child(jobId).child(applicationId).update({status: 'accept'}, function(error){
          if(error){
            Materialize.toast('Try again', 4000);
          } else {
            Materialize.toast('Accept Notification sent', 4000);
          }
        });
      };

      self.rejectApplication = function(applicationId){
        console.log('reject');
        ref.child('application').child(jobId).child(applicationId).update({status: 'reject'}, function(error){
          if(error){
            Materialize.toast('Try again', 4000);
          } else {
            Materialize.toast('Reject Notification sent', 4000);
          } 
        });
      };

        $scope.goTo = function(page) {
        switch (page) {
          case 'profile':
            $location.path('/profile');
            break;
          case 'chatRooms':
            if(authData.password.email.charAt(4)==="1"){
               $location.path('/createChat');
            }
            else {
              $location.path('/chatRooms');
            }
            
            break;
          case 'jobs':
            if(authData.password.email.charAt(4)==="1"){
               $location.path('/posting');
            }
            else {
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
