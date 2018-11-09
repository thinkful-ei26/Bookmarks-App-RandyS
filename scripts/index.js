'use strict';
/*global bookmarkList, store, api*/

$(document).ready(function() {
  bookmarkList.bindEventListeners();
  // bookmarkList.render();

  api.getBookmarks((bookmarks) => {
    bookmarks.forEach((bookmark) => store.addItem(bookmark));

  });
  bookmarkList.render();
});

//render bookmarks
//API GET
