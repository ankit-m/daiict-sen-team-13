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
    'ngAnimate',
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
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
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
      .otherwise({
        redirectTo: '/'
      });
  });
