'use strict';

const api = (function() {
  
  const BASE_URL = 'https://thinkful-list-api.herokuapp.com/randys/bookmarks';

  const getBookmarks = function(callback) {
    $.getJSON(`${BASE_URL}`, callback);
  };

  const addBookmark = function(newBookmark, onSuccess, onError) {
    const bookmark = JSON.stringify(newBookmark);
    $.ajax({
      url: `${BASE_URL}`,
      method: 'POST',
      contentType: 'application/json',
      data: bookmark,
      success: onSuccess,
      error: onError,
    });
  };

  const deleteBookmark = function(id, onSuccess){
    $.ajax({
      url: `${BASE_URL}/${id}`,
      method: 'DELETE',
      contentType: 'application/json',
      success: onSuccess,
    });
  };

  return {
    getBookmarks,
    addBookmark,
    deleteBookmark,
  };

}() );
