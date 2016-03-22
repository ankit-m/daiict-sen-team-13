'use strict';

/**
 * @ngdoc function
 * @name daiictSenTeam13App.controller:ProfileCtrl
 * @description
 * # ProfileCtrl
 * Controller of the daiictSenTeam13App
 */
angular.module('daiictSenTeam13App')
  .controller('ProfileCtrl', function() {
    var ref = new Firebase('https://sfip.firebaseio.com/');
    var authData = ref.getAuth();

    if (authData) {
      console.log("Authenticated user with uid:", authData.uid);
    }
  });
