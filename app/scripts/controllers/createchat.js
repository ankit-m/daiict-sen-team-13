(function() {
  'use strict';
  /**
   * @ngdoc function
   * @name daiictSenTeam13App.controller:CreatechatCtrl
   * @description
   * # CreatechatCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('CreatechatCtrl', ['$scope', '$location', function($scope, $location) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();
      var self = this;

      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }

      $scope.initMaterial = function() {
        $(document).ready(function() {
          $(".button-collapse").sideNav();
          $('select').material_select();
        });
      };
      $scope.initMaterial();

      self.logout = function() {
        console.log('logout called');
        ref.unauth();
        console.log('logged out');
        $location.path('/');
      };

      //@author: Rajiv
      //@reviewer: Ankit
      self.createChatRoom = function() {
        console.log('createChatRoom called');

        ref.child('chatRooms').push({
          "chatRoomName": $scope.chatName,
          "createdBy": authData.password.email,
          "startTime": $scope.startTime,
          "description": $scope.chatDescription,
          "active": true
        }, function(error) {
          if (error) {
            Materialize.toast('Could not create ChatRoom. Please try again', 4000);
          } else {
            Materialize.toast('Created ChatRoom', 4000);
          }
        });

        console.log('createChatRoom return');
      };

    }]);
})();
