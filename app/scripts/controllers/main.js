(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name daiictSenTeam13App.controller:MainCtrl
   * @description
   * # MainCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('MainCtrl', ['$scope', function($scope) {
      $scope.email = '';
      $scope.password = '';
      //  = submit; /*Self and this function used before definition*/

      $scope.submit = function() {
        console.log($scope.email);
        console.log($scope.password);
      };
    }]);
})();
