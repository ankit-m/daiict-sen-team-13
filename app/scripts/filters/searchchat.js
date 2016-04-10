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
  .filter('searchChat', function() {
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
        //console.log("These are interests length",value.interests);
        var actual = ('' + value.sender).toLowerCase();
        var actual2 = ('' + value.text).toLowerCase();
        if (actual.indexOf(expected) !== -1 || actual2.indexOf(expected) !== -1) {
          result[key] = value;
        }
      });
      return result;
    };
  });
