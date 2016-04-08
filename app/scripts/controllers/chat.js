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
    .controller('ChatCtrl', ['$scope', '$location', '$routeParams', '$timeout','$window','$rootScope', function($scope, $location, $routeParams, $timeout,$window, $rootScope) {
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
      $scope.kicked=false;
      $scope.myKicked=0;
      $scope.leaveRoom=false;

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
        $scope.leaveRoom=true;

         var removeMemberRef=new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/members/");
         removeMemberRef.orderByChild('emailId').equalTo(authData.password.email).on("value", function(dataSnapshot) {
          console.log("Trying to leave room",$scope.leaveRoom);
        //console.log(authData.password.email);
          console.log("Chutiyapa")
          dataSnapshot.forEach(function(data) {
           // console.log(data.key());
            removeMemberRef=new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/members/"+data.key()+"/"); 
            if($scope.leaveRoom===true){
              removeMemberRef.remove();
              tempChatRoomRef.update({"slots":$scope.slots+1});
              console.log("yooooooo");
              $scope.leaveRoom=false;
              $location.path('/chatRooms');
            }

         });
        });

          
      };
   
     $window.onbeforeunload =  function(){
       $scope.leaveThisRoom();
     };

     var myMemberRef= new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/members/");
         myMemberRef.orderByChild('emailId').equalTo(authData.password.email).on("value", function(dataSnapshot) {
        //console.log(authData.password.email);
          console.log("Chutiyapa")
          dataSnapshot.forEach(function(data) {
           // console.log(data.key());
            myMemberRef=new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/members/"+data.key()+"/");          
              console.log("HEY BRUH");
              console.log("kicked so many times...",data.val().kicked);
               myMemberRef.on('child_changed',function(dataSnapshot){
               console.log("change aave");
               $location.path('/chatRooms');
                        
          });
        });



         });



     $scope.kickMember=function(email){
         var removeMemberRef=new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/members/");
         removeMemberRef.orderByChild('emailId').equalTo(email).on("value", function(dataSnapshot) {
        //console.log(authData.password.email);
          console.log("Chutiyapa")
          dataSnapshot.forEach(function(data) {
           // console.log(data.key());
            removeMemberRef=new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/members/"+data.key()+"/"); 
            $scope.kicked=data.val().kicked;
            console.log("kick data",$scope.kicked);
          });
        });
        removeMemberRef.update({"kicked":$scope.kicked+1});
        tempChatRoomRef.update({"slots":$scope.slots+1});
        console.log("yooooooo");
        //$location.path('/chatRooms');
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
            if ($rootScope.userType===true) {
              $location.path('/createChat');
            } else {
              $location.path('/chatRooms');
            }

            break;
          case 'jobs':
            if ($rootScope.userType===true) {
              $location.path('/posting');
            } else {
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
