'use strict';
/*global bookmarkList, store, api*/

$(document).ready(function() {
  bookmarkList.bindEventListeners();

  api.getBookmarks((bookmarks) => {
    bookmarks.forEach((bookmark) => store.addItem(bookmark));
    bookmarkList.render();
  });
});