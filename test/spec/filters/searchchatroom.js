'use strict';

describe('Filter: searchChatRoom', function () {

  // load the filter's module
  beforeEach(module('daiictSenTeam13App'));

  // initialize a new instance of the filter before each test
  var searchChatRoom;
  beforeEach(inject(function ($filter) {
    searchChatRoom = $filter('searchChatRoom');
  }));

  it('should return the input prefixed with "searchChatRoom filter:"', function () {
    var text = 'angularjs';
    expect(searchChatRoom(text)).toBe('searchChatRoom filter: ' + text);
  });

});
