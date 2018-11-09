'use strict';
/*global store, api, $ */

const bookmarkList = (function() {

  function generateError(err) {
    let message = '';
    if (err.responseJSON && err.responseJSON.message) {
      message = err.responseJSON.message;
    } else {
      message = `${err.code} Server Error`; 
    }

    return `
      <section role="alert" class="error-content">
        <button id="cancel-error">X</button>
        <p>${message}</p>
      </section>
    `;
  }

  function generateItemElement(item) {
    const expandedClass = store.items.expanded ? 'js-item-element-expanded' : '';
    let expandedContent = '<div class="bookmark-item-controls"></div';


  
    if (item.rating === null) {
      item.rating = 'No rating yet';
    } 


    let itemTitle = `<span class="bookmark-item ${expandedClass}"><h2>${item.title}</h2></span>`;

    if (item.expanded) { 
      expandedContent = `
      <div class="bookmark-item-controls">
      <div class="bookmark-item-description">
        <p>${item.desc}</p>
      </div>
      <br>
      <div class="bookmark-item-url">
        <a href='${item.url}'>Visit ${item.title}</a>
      </div>
        <form class="bookmark-item-delete js-item-delete">
          <button class="button-label" id="delete-button">Remove this bookmark</button>
        </form>
        <form class="hide-details">
          <button class="button-label" id="hide-details-button">Hide Details</button>
        </form>
      </div>`;
    }

    return `
              <li class="js-item-element" data-item-id="${item.id}">
              <header role="banner">
                ${itemTitle}
                    <div class="bookmark-rating">Rating: ${item.rating}</div>
                  <form class="description-expansion">
                    <button class="submit" id="details-button">View Details</button>
                  </form>
                </header>
                ${expandedContent}
              </li>`;
  }

  function generateBookmarkItemsString(bookmarksList) {
    const items = bookmarksList.map((item) => generateItemElement(item));
    return items.join('');
  }

  function generateNewBookmarkHTML() {
    return `
      <form class="js-create-bookmark-form">
        <header>
          <h2>Create New Bookmark</h2>
        </header>
        <div class="input-groups">
          <div class="input-group">
            <label for="bookmark-name-entry">Bookmark name: </label> 
            <input type="text" name="title" id="js-bookmark-name-entry" placeholder="Required Field">    
          </div>
          <hr>
            <div class="input-group">
              <label for="bookmark-url-entry">URL address: </label> 
              <input type="text" name="url" id="js-bookmark-url-entry" placeholder="Required Field">                
          </div>
          <hr>
          <div class="input-group">
            <label for="bookmark-description-entry">Bookmark description: </label> 
            <input type="text" name="desc" class="js-bookmark-description-entry" placeholder="Optional">
          </div>
          <hr>
          <div class="input-group">
            <select for ="rating" name ="rating" class ="js-bookmark-rating-entry">
              <option selected disabled>Choose a rating</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
        </div>
        <hr>
        <div class="input-group">
          <input type="submit"></button>
        </div>
        <div class="input-group">
          <button class="cancel-button">Cancel</button>
        </div>
      </div>
      </form>
      `;
  }
       
  function render() {

    let bookmarks = [...store.items];
    
    if (store.addingBookmark) {
      $('.create-new-bookmark').html(generateNewBookmarkHTML);
    } else if (store.filterRating) {
      bookmarks = store.items.filter(bookmark => bookmark.rating >= store.filterRating);
      const bookmarkListItemsString = generateBookmarkItemsString(bookmarks);
      $('.js-bookmark-list').html(bookmarkListItemsString);
    } else { 
      $('.js-create-bookmark-form').remove();
      const bookmarkListItemsString = generateBookmarkItemsString(bookmarks);
      $('.js-bookmark-list').html(bookmarkListItemsString);
    }
  }

  function handleNewItemClicked() {
    $('#js-bookmark-list-form').click(event => {
      event.preventDefault();
      store.addingBookmark = true;
      render();
    });
  }

  const handleCreateBookmark = function(){
    $('.create-new-bookmark').on('submit', event => {
      event.preventDefault();
      const newBookmark = $(event.target).serializeJson();
      store.addingBookmark = false;
      api.addBookmark(newBookmark, 
        (data) => {
          store.addItem(data);
          render();
        },
        (err) => {
          store.setError(err);
          const html = generateError(err);
          $('.js-bookmark-list').html(html);
        }
      );
    });
  };

  function handleExpandBookmark(){
    $('.js-bookmark-list').on('click', '.description-expansion', event => {
      const id = getIdFromBookmark(event.target);
      const expandedBookmark = store.findById(id);
      expandedBookmark.expanded = !expandedBookmark.expanded;
      render();
      $('.description-expansion').toggle();
    });
  }

  function handleHideBookmark(){
    $('.js-bookmark-list').on('click', '.hide-details', event => {
      const id = getIdFromBookmark(event.target);
      const expandedBookmark = store.findById(id);
      expandedBookmark.expanded = !expandedBookmark.expanded;
      render();
    });
  }

  function handleDeleteButtonClicked() {
    $('.js-bookmark-list').on('submit', '.bookmark-item-delete', event => {
      event.preventDefault();
      const id = getIdFromBookmark(event.target);
      api.deleteBookmark(id, 
        () => {
          store.findAndDelete(id);
          render();
        },
        (err) => {
          console.log(err);
          store.setError(err);
          render();
        }
      );
    });
  }

  function handleCancelNewBookmarkClicked() {
    $('.container').on('click', '.cancel-button', event => {
      event.preventDefault();
      store.addingBookmark = false;
      $('.create-bookmark-form').attr('hidden="true"');
      render();
    });
  }

  function getIdFromBookmark(bookmark){
    return $(bookmark).closest('.js-item-element').data('item-id');
  }

  function handleFilter() {
    $('.js-bookmark-filter-entry').change(event=> {
      event.preventDefault();
      const filterSetting = $('.js-bookmark-filter-entry').val();
      store.setFilterRating(filterSetting);
      render();
    }); 
  }

  function handleBadSubmissionCancelButton() {
    $('.container').on('click', '#cancel-error', event => {
      event.preventDefault();
      $('.error-content').remove();
    });
  }

  $.fn.extend({
    serializeJson: function(){
      const obj = {};
      const data = new FormData(this[0]);
      data.forEach((value,key)=>{
        obj[key] = value;
      });
      return obj;
    }
  });

  function bindEventListeners() {
    handleNewItemClicked();
    handleCreateBookmark();
    handleExpandBookmark();
    handleCancelNewBookmarkClicked();
    handleDeleteButtonClicked();
    handleFilter();
    handleBadSubmissionCancelButton();
    handleHideBookmark();
  }

  return {
    bindEventListeners,
    render,
  };

}() );