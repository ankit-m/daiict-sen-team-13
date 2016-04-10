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
  .filter('searchJobs', function() {
    return function(input, search) {
      if (!input) {
        return input;
      }
      if (!search) {
        return input;
      }
      var expected = ('' + search).toLowerCase();
      var result = {};
      angular.forEach(input, function(value, key) {
        var actual = ('' + value.jobName).toLowerCase();
        var actual2 = ('' + value.description).toLowerCase();
        var actual3 = ('' + value.location).toLowerCase();
        var actual4 = ('' + value.postedBy).toLowerCase();
        if (actual.indexOf(expected) !== -1 || actual2.indexOf(expected) !== -1 || actual3.indexOf(expected) !== -1 || actual4.indexOf(expected) !== -1) {
          result[key] = value;
        }
      });
      return result;
    };
  });
