'use strict';

/**
 * @ngdoc filter
 * @name daiictSenTeam13App.filter:searchChat
 * @function
 * @description
 * # searchChat
 * Filter in the daiictSenTeam13App.
 */
angular.module('daiictSenTeam13App')
  .filter('searchChat', function () {
    return function (input) {
      return 'searchChat filter: ' + input;
    };
  });
