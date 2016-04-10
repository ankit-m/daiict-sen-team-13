'use strict';

describe('Filter: searchChat', function () {

  // load the filter's module
  beforeEach(module('daiictSenTeam13App'));

  // initialize a new instance of the filter before each test
  var searchChat;
  beforeEach(inject(function ($filter) {
    searchChat = $filter('searchChat');
  }));

  it('should return the input prefixed with "searchChat filter:"', function () {
    var text = 'angularjs';
    expect(searchChat(text)).toBe('searchChat filter: ' + text);
  });

});
