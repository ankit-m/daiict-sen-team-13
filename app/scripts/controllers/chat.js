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
      $scope.leaveRoom=false;
      $scope.createdBy="";
      $scope.kickMyself=false;

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

      tempChatRoomRef.child("createdBy").on("value",function(snapshot){
         $scope.createdBy=snapshot.val();
      });
      tempChatRoomRef.child("slots").on('value',function(snapshot){
        $scope.slots=snapshot.val();
      });

      chatRoomMemberRef.on("child_removed", function(snapshot) {
        var deletedMember = snapshot.val();
      });
      
      myChatRoomRef.on('value', function(dataSnapshot) {
        $scope.chatHistory = dataSnapshot.val();
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
        }
        $scope.loading=false;
        $timeout(function() {
          $scope.$apply();
        });

      });     

      chatRoomMemberRef.orderByChild("active").equalTo(1).on('value', function(dataSnapshot) {
        $scope.members = dataSnapshot.val();
        var member=null;
        for (var member in $scope.members){
          if(authData.password.email===$scope.createdBy && authData.password.email!==$scope.members[member].emailId){
            $scope.members[member].showKick=true;  
          }
          else{
           $scope.members[member].showKick=false;  
          } 
        }
        $timeout(function() {
          $scope.$apply();
        });
      });

      $scope.sentMessage = function() {
        if ($scope.messageInput === "") {
          alert("Enter some message to send before pressing enter.");
          } 
        else {
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
          dataSnapshot.forEach(function(data) {
            removeMemberRef=new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/members/"+data.key()+"/"); 
         });
        });
          removeMemberRef.remove();
          tempChatRoomRef.update({"slots":$scope.slots+1});
          $scope.leaveRoom=false;
          $location.path('/chatRooms');   
      };
   
     $window.onbeforeunload =  function(){
       $scope.leaveThisRoom();
     };

     var myMemberRef= new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/members/");
         myMemberRef.orderByChild('emailId').equalTo(authData.password.email).on("value", function(dataSnapshot) {
          dataSnapshot.forEach(function(data) {
            myMemberRef=new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/members/"+data.key()+"/");          
            myMemberRef.on('child_changed',function(dataSnapshot){
            myMemberRef.update({
               "active":0
            });  
            $location.path('/chatRooms');           
            });
          });
        });

     $scope.kickMember=function(email){
         var removeMemberRef=new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/members/");
         removeMemberRef.orderByChild('emailId').equalTo(email).on("value", function(dataSnapshot) {
          dataSnapshot.forEach(function(data) {
            removeMemberRef=new Firebase('https://sfip.firebaseio.com/chatRooms/' + key + "/members/"+data.key()+"/"); 
            $scope.kicked=data.val().kicked;
          });
        });
        removeMemberRef.update({"kicked":$scope.kicked+1});
        tempChatRoomRef.update({"slots":$scope.slots+1});
     };

     $scope.viewMemberProfile=function(email){ 
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


  angular.module('daiictSenTeam13App').filter('customMessages', function() {
  return function(input, search) {
    if (!input) return input;
    if (!search) return input;
    var expected = ('' + search).toLowerCase();
    var result = {};
    angular.forEach(input, function(value,key) {
      //console.log("These are interests length",value.interests);
      var actual = ('' + value.sender).toLowerCase();
      var actual2 = ('' + value.text).toLowerCase();
      if (actual.indexOf(expected) !== -1 || actual2.indexOf(expected) !== -1  ) {
        result[key] = value;
      }
    });
    return result;
  }
});


})();