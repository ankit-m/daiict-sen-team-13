'use strict';

/**
 * @ngdoc overview
 * @name daiictSenTeam13App
 * @description
 * # daiictSenTeam13App
 *
 * Main module of the application.
 */
angular
  .module('daiictSenTeam13App', [
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'profile'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register'
      })
      .when('/student', {
        templateUrl: 'views/student.html',
        controller: 'StudentCtrl',
        controllerAs: 'student'
      })
      .when('/jobs', {
        templateUrl: 'views/jobs.html',
        controller: 'JobsCtrl',
        controllerAs: 'jobs'
      })
      .when('/posting', {
        templateUrl: 'views/posting.html',
        controller: 'PostingCtrl',
        controllerAs: 'posting'
      })
      .when('/application', {
        templateUrl: 'views/application.html',
        controller: 'ApplicationCtrl',
        controllerAs: 'application'
      })
      .when('/faculty', {
        templateUrl: 'views/faculty.html',
        controller: 'FacultyCtrl',
        controllerAs: 'faculty'
      })
      .when('/viewJob', {
        templateUrl: 'views/viewjob.html',
        controller: 'ViewjobCtrl',
        controllerAs: 'viewJob'
      })
      .when('/chatRooms', {
        templateUrl: 'views/chatrooms.html',
        controller: 'ChatroomsCtrl',
        controllerAs: 'chatRooms'
      })
      .when('/createChat', {
        templateUrl: 'views/createchat.html',
        controller: 'CreatechatCtrl',
        controllerAs: 'createChat'
      })
      .when('/resetPassword', {
        templateUrl: 'views/resetpassword.html',
        controller: 'ResetpasswordCtrl',
        controllerAs: 'resetPassword'
      })
      .when('/chat', {
        templateUrl: 'views/chat.html',
        controller: 'ChatCtrl',
        controllerAs: 'chat'
      })
      .when('/people', {
        templateUrl: 'views/people.html',
        controller: 'PeopleCtrl',
        controllerAs: 'people'
      })
      .when('/viewProfile', {
        templateUrl: 'views/viewprofile.html',
        controller: 'ViewprofileCtrl',
        controllerAs: 'viewProfile'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
