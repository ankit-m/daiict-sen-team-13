'use strict';

/**
 * @ngdoc function
 * @name daiictSenTeam13App.controller:StudentCtrl
 * @description
 * # StudentCtrl
 * Controller of the daiictSenTeam13App
 */
angular.module('daiictSenTeam13App')
  .controller('StudentCtrl', function() {
    $scope.initCollapsible = function() {
      $(document).ready(function() {
        $('.collapsible').collapsible({
          accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
      });
    };
    $scope.initCollapsible();
  });
