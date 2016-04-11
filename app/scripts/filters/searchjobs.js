'use strict';

/**
 * @ngdoc filter
 * @name daiictSenTeam13App.filter:searchJobs
 * @function
 * @description
 * # searchJobs
 * Filter in the daiictSenTeam13App.
 */
angular.module('daiictSenTeam13App')
  .filter('searchJobs', function () {
    return function (input) {
      return 'searchJobs filter: ' + input;
    };
  });
