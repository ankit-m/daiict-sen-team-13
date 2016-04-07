(function() {
  'use strict';
  //TODO: date UTC format
  /**
   * @ngdoc function
   * @name daiictSenTeam13App.controller:ChatCtrl
   * @description
   * # ChatCtrl
   * Controller of the daiictSenTeam13App
   */
  angular.module('daiictSenTeam13App')
    .controller('ChatCtrl', ['$scope', '$location', '$routeParams', '$timeout','$window', function($scope, $location, $routeParams, $timeout,$window) {
      var ref = new Firebase('https://sfip.firebaseio.com/');
      var authData = ref.getAuth();
      var key = $routeParams.roomId;
      var tempChatRoomRef = new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/");
      var chatRoomMemberRef = new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/members/");
      var myChatRoomRef = new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/messages/");
      $scope.loading=true;
      $scope.chatHistory = [];
      $scope.members = [];
      var clicked;

      if (authData) {
        console.log("Authenticated user with uid:", authData.uid);
      } else {
        $location.path('/');
      }

      $scope.initMaterial = function() {
        $(document).ready(function() {
          $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
          });
        });
        $(".button-collapse").sideNav();
      };
      $scope.initMaterial();

      $scope.logout = function() {
        console.log('logout called');
        ref.unauth();
        console.log('logged out');
        $location.path('/');
      };

      $scope.initCollapsible = function() {
        $(document).ready(function() {
          $('.collapsible').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
          });
        });
      };
      $scope.initCollapsible();

      tempChatRoomRef.child("slots").on('value',function(snapshot){
        console.log("Slots");
        console.log(snapshot.val());
        $scope.slots=snapshot.val();
      });

      chatRoomMemberRef.on("child_removed", function(snapshot) {
        var deletedMember = snapshot.val();
        console.log("The user'" + deletedMember.emailId + "' has been deleted");
      });
      
      myChatRoomRef.on('value', function(dataSnapshot) {
        //console.log(dataSnapshot.val());
        $scope.chatHistory = dataSnapshot.val();
        console.log("CHAT HISTORY", $scope.chatHistory)
        var message=null;
        for(message in $scope.chatHistory){
          if($scope.chatHistory[message].sender==authData.password.email){
            $scope.chatHistory[message].sender="You:"
            $scope.chatHistory[message].alignment="right-align"
          }
          else {
            $scope.chatHistory[message].sender+=":"
            $scope.chatHistory[message].alignment="left-align"
          } 
        console.log($scope.chatHistory[message].alignment)
        }
        $scope.loading=false;
        $timeout(function() {
          $scope.$apply();
        });

      });     

      chatRoomMemberRef.on('value', function(dataSnapshot) {
        $scope.members = dataSnapshot.val();
        $timeout(function() {
          $scope.$apply();
        });
      });

      $scope.sentMessage = function() {
        if ($scope.messageInput === "") {
          alert("Enter some message to send before pressing enter.");
          } 
        else {
          console.log("Enterrrrrrrrrrrrr");          
          tempChatRoomRef.child("messages").push({
            "sender": authData.password.email,
            "text": $scope.messageInput
          });
        $scope.messageInput = "";
        $timeout(function() {
        $scope.$apply();
          });
        }
      };

      $scope.myFunct = function(keyEvent) {
        if (keyEvent.which === 13) {
          if ($scope.messageInput === "") {
            alert("Enter some message to send before pressing enter.");
            } 
            else {
              console.log("Enterrrrrrrrrrrrr");
              var tempChatRoomRef = new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/");
              tempChatRoomRef.child("messages").push({
                "sender": authData.password.email,
                "text": $scope.messageInput,
                });
              $scope.messageInput = "";
              $timeout(function() {
              $scope.$apply();
              });
            }
          }
        };

      $scope.leaveThisRoom=function(){
         var removeMemberRef=new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/members/");
         removeMemberRef.orderByChild('emailId').equalTo(authData.password.email).on("value", function(dataSnapshot) {
        //console.log(authData.password.email);
          console.log("Chutiyapa")
          dataSnapshot.forEach(function(data) {
           // console.log(data.key());
            removeMemberRef=new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/members/"+data.key()+"/"); 
          });
        });
        removeMemberRef.remove();
        tempChatRoomRef.update({"slots":$scope.slots+1});
        console.log("yooooooo");
        $location.path('/chatRooms');  
      };
   
     $window.onbeforeunload =  function(){
       $scope.leaveThisRoom();
     };

     $scope.viewMemberProfile=function(email){ 
      console.log("some random text");
       $location.path('/viewProfile').search({
          'profileId': email
        });
     }

      $scope.goTo = function(page) {
        switch (page) {
          case 'profile':
            $location.path('/profile');
            break;
          case 'chatRooms':
            if(authData.password.email.charAt(4)==="1"){
               $location.path('/createChat');
            }
            else {
              $location.path('/chatRooms');
            } 
            break;
          case 'jobs':
            if(authData.password.email.charAt(4)==="1"){
               $location.path('/posting');
            }
            else {
              $location.path('/jobs');
            }
            break;
          case 'people':
            $location.path('/people');
            break;
          default:
            $location.path('/');
        }
      };
      

    }]);
})();
