'use strict';
// eslint-disable-next-line no-unused-vars
const store = (function() {

  const items = [];
  const addingBookmark = false;
  const error = null;

  const setError = function(error) {
    this.error = error;
  };

  
  const addItem = function(item) {
    this.items.push(item);
  };
  
  // const createItem = function(title, url, description, rating) {
  //   return { 
  //     title,
  //     url,
  //     description,
  //     rating
  //   };
  //   // this.addItem(newBookmark);
  // };

  const findById = function(id) {
    return this.items.find(item => item.id === id);
  };

  const findAndDelete = function(id) {
    this.items = this.items.filter(bookmark => bookmark.id !== id);
  };

  const setFilterRating = function(val) {
    this.filterRating = val;
  };

  return {
    items,
    error,
    addingBookmark,
    setError,
    addItem,
    findById,
    findAndDelete,
    setFilterRating,
    // createItem,
  };

}() );
