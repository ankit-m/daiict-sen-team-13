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
  .filter('searchPeople', function() {
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
        var actual = ('' + value.firstName).toLowerCase();
        var actual2 = ('' + value.institute).toLowerCase();
        var actual3 = ('' + value.lastName).toLowerCase();
        var actual4 = ('' + value.email).toLowerCase();
        if (actual.indexOf(expected) !== -1 || actual2.indexOf(expected) !== -1 || actual3.indexOf(expected) !== -1 || actual4.indexOf(expected) !== -1) {
          result[key] = value;
        }
      });
      return result;
    };
  });
