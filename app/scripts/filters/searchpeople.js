'use strict';

/**
 * @ngdoc filter
 * @name daiictSenTeam13App.filter:searchPeople
 * @function
 * @description
 * # searchPeople
 * Filter in the daiictSenTeam13App.
 */
angular.module('daiictSenTeam13App')
  .filter('searchPeople', function () {
    return function (input) {
      return 'searchPeople filter: ' + input;
    };
  });
