'use strict';
// eslint-disable-next-line no-unused-vars
const store = (function() {

  const items = [];
  const addingBookmark = false;
  const error = null;
  const updatingBookmark = false;
  const updateBookmarkId = '';

  const setError = function(error) {
    this.error = error;
  };
  
  const addItem = function(item) {
    this.items.push(item);
  };

  const findById = function(id) {
    return this.items.find(item => item.id === id);
  };

  const findAndDelete = function(id) {
    this.items = this.items.filter(bookmark => bookmark.id !== id);
  };

  const setFilterRating = function(val) {
    this.filterRating = val;
  };

  const setBookmarkIsUpdating = function(id, isUpdating) {
    const bookmark = this.findById(id);
    bookmark.isUpdating = isUpdating;
  };

  const findAndUpdate = function(id, newData) {
    const bookmark = this.findById(id);
    Object.assign(bookmark, newData);
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
    setBookmarkIsUpdating,
    findAndUpdate,
    updatingBookmark,
    updateBookmarkId,
  };

}() );
