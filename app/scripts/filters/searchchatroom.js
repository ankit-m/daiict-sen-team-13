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
  .filter('searchChatRoom', function () {
    return function (input) {
      return 'searchChatRoom filter: ' + input;
    };
  });
