'use strict';
// eslint-disable-next-line no-unused-vars

const store = (function() {
  const setError = function(error) {
    this.error = error;
  };

  const addItem = function(item) {
    this.items.push(item);
  };

  const findById = function(id) {
    return this.items.find(item => item.id === id);
  };

  return {
    items: [],
    error: null,
    setError,
    addItem,
    findById,
  };

}() );
