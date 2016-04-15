'use strict';

/**
 * @ngdoc filter
 * @name daiictSenTeam13App.filter:searchChatRoom
 * @function
 * @description
 * # searchChatRoom
 * Filter in the daiictSenTeam13App.
 */
angular.module('daiictSenTeam13App')
  .filter('searchChatRoom', function() {
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
        var actual = ('' + value.chatRoomName).toLowerCase();
        var actual2 = ('' + value.description).toLowerCase();
        var actual3 = ('' + value.days).toLowerCase();
        var actual4 = ('' + value.startTime).toLowerCase();
        var actual5 = ('' + value.createdBy).toLowerCase();

        if (actual.indexOf(expected) !== -1 || actual2.indexOf(expected) !== -1 || actual3.indexOf(expected) !== -1 || actual4.indexOf(expected) !== -1 || actual5.indexOf(expected) !== -1) {
          result[key] = value;
        }
      });
      return result;
    };
  });
