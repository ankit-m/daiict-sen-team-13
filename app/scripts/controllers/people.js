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
    .controller('PeopleCtrl', ['$scope', '$location', '$timeout', function($scope, $location, $timeout) {
       var ref = new Firebase('https://sfip.firebaseio.com/');
       var authData = ref.getAuth();


      
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