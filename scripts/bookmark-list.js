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

  function generateItemUpdate(bookmark) {
    console.log('inside the SPECIAL PLACE');
    return `<li class="js-item-element" data-item-id="${bookmark.id}">
              <header role="banner">
              <span class="bookmark-item"></span>
              </header>
              <div class="input-group">
              <label for="bookmark-name-update">Update name: </label> 
              <input type="text" name="bookmark-name-update" id="js-bookmark-name-update" placeholder="Required Field">    
          </div>
          <hr>
          <div class="input-group">
          <p>Update Rating</p><select for="rating-update" name ="bookmark-rating-update" class ="js-bookmark-rating-update">
            <option>Choose a Rating</option>
            <option value="1">1 Star</option>
            <option value="2">2 Stars</option>
            <option value="3">3 Stars</option>
            <option value="4">4 Stars</option>
            <option value="5">5 Stars</option>
          </select>
        </div>
        <div class="bookmark-item-controls">
        <div class="input-group">
            <label for="bookmark-description-update">Update description: </label> 
            <input type="text" name="bookmark-description-update" class="js-bookmark-description-update" placeholder="Optional">
          </div>
        <hr>
        <div class="input-group">
            <label for="bookmark-url-entry">Update URL address: </label> 
            <input type="text" name="bookmark-url-entry" id="js-bookmark-url-entry" placeholder="Required Field">                
          </div>
          <hr>
        <div class="modify-item">
          <form class="bookmark-item-save js-item-save">
            <button class="button-label" id="save-update-button">Save these updates</button>
          </form>
        <div>
        <form class="cancel-update">
          <button class="button-label" id="cancel-update-button">Cancel Update</button>
        </form>
      </div>

      </li>`;
  }

  function generateItemElement(item) {
    const expandedClass = store.items.expanded ? 'js-item-element-expanded' : '';
    const updatingClass = store.items.updating ? 'js-item-element-updating' : '';
    let expandedContent = '<div class="bookmark-item-controls"></div';

    let itemTitle = `<span class="bookmark-item ${expandedClass} ${updatingClass}"><h2>${item.title}</h2></span>`;

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

        <div class="modify-item">
          <form class="bookmark-item-update js-item-update">
            <button class="button-label" id="update-button">Update this bookmark</button>
          </form>
          <form class="bookmark-item-delete js-item-delete">
            <button class="button-label" id="delete-button">Remove this bookmark</button>
          </form>
        <div>
        <form class="hide-details">
          <button class="button-label" id="hide-details-button">Hide Details</button>
        </form>
      </div>`;
    }

    return `
              <li class="js-item-element" data-item-id="${item.id}">
              <header role="banner">
                ${itemTitle}
                    <div class="bookmark-rating">Rating: ${item.rating} star(s)</div>
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
            <input type="text" name="bookmark-name-entry" id="js-bookmark-name-entry" placeholder="Required Field">    
          </div>
          <hr>
            <div class="input-group">
              <label for="bookmark-url-entry">URL address: </label> 
              <input type="text" name="bookmark-url-entry" id="js-bookmark-url-entry" placeholder="Required Field">                
          </div>
          <hr>
          <div class="input-group">
            <label for="bookmark-description-entry">Bookmark description: </label> 
            <input type="text" name="bookmark-description-entry" class="js-bookmark-description-entry" placeholder="Optional">
          </div>
          <hr>
          <div class="input-group">
            <select for ="rating" name ="bookmark-rating-entry" class ="js-bookmark-rating-entry">
              <option>Choose a Rating</option>
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
    } else if (store.updatingBookmark) {
      const bookmark = store.items.filter(bookmark => bookmark.isUpdating);
      const bookmarkToUpdate = generateItemUpdate(bookmark);
      $('.js-bookmark-list').html(bookmarkToUpdate);
    }
    
    
    else { 
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
      const title = $(event.target).find('[name="bookmark-name-entry"]').val();
      const url = $(event.target).find('[name="bookmark-url-entry"]').val();
      let desc = $(event.target).find('[name="bookmark-description-entry"]').val();
      desc === '' ? desc = 'no description yet...' : desc;
      let newBookmark = { title: title, url: url, desc: desc };
      let rating = $(event.target).find('[name="bookmark-rating-entry"] option:selected').val();
      console.log(rating)
      if (rating !== 'Choose a Rating') {
        newBookmark.rating = rating;
      }

      console.log(newBookmark);
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

  function handleUpdateButtonClicked() {
    $('.js-bookmark-list').on('submit', '.bookmark-item-update', event => {
      event.preventDefault();
      store.updatingBookmark = !store.updatingBookmark;
      
      store.updateBookmarkId = getIdFromBookmark(event.target);
      const updatingBookmark = store.findById(store.updateBookmarkId);
      updatingBookmark.updating = !updatingBookmark.updating;

      render();
      //pass editing property to store
      //render the page with all properties now input fields
      //enter all day
      //run create items again??
      
    });

  }

  function saveUpdatedBookmark() {
    $('.js-bookmark-list').on('submit', '.bookmark-item-save', event=> {
      event.preventDefault();
      // const id = getIdFromBookmark(event.target);
      // console.log(event.target);
      const title = $(event.target).find('[name="bookmark-name-entry"]').val();
      console.log(title)
      const url = $(event.target).find('[name="bookmark-url-entry"]').val();
      console.log(url)
      let desc = $(event.target).find('[name="bookmark-description-entry"]').val();
      desc === '' ? desc = 'no description yet...' : desc;
      console.log(desc)
      let rating = $(event.target).find('[name="bookmark-rating-entry"] option:selected').val();
      rating === '' ? rating = 'no rating yet...' : rating;
      console.log(rating)
      store.addingBookmark = false;
      let updatedBookmark = { title: title, url: url, desc: desc, rating: rating };
      api.updateBookmark(store.updateBookmarkId, updatedBookmark,
        () => {
          store.findAndUpdate(store.updateBookmarkId, updatedBookmark);
          store.setBookmarkIsUpdating(store.updateBookmarkId, false);
          store.updateBookmarkId = '';
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

  function bindEventListeners() {
    handleNewItemClicked();
    handleCreateBookmark();
    handleExpandBookmark();
    handleCancelNewBookmarkClicked();
    handleDeleteButtonClicked();
    handleFilter();
    handleBadSubmissionCancelButton();
    handleHideBookmark();
    handleUpdateButtonClicked();
    saveUpdatedBookmark();
  }

  return {
    bindEventListeners,
    render,
  };

}() );