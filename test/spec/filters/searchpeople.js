'use strict';

describe('Filter: searchPeople', function () {

  // load the filter's module
  beforeEach(module('daiictSenTeam13App'));

  // initialize a new instance of the filter before each test
  var searchPeople;
  beforeEach(inject(function ($filter) {
    searchPeople = $filter('searchPeople');
  }));

  it('should return the input prefixed with "searchPeople filter:"', function () {
    var text = 'angularjs';
    expect(searchPeople(text)).toBe('searchPeople filter: ' + text);
  });

});
