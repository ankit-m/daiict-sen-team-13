'use strict';

describe('Filter: searchJobs', function () {

  // load the filter's module
  beforeEach(module('daiictSenTeam13App'));

  // initialize a new instance of the filter before each test
  var searchJobs;
  beforeEach(inject(function ($filter) {
    searchJobs = $filter('searchJobs');
  }));

});
