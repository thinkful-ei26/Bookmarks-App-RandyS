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
    // let updatingBookmark = 
    console.log('inside the SPECIAL PLACE');
    console.log(` what  ++++++++++++++++ ${bookmark}`)
    return `
    <li class="js-item-element" data-item-id="${bookmark.id}">
      <form class="js-item-update-form>
              <header role="banner">${bookmark.title}
              <span class="bookmark-item"></span>
              </header>
              <div class="input-group">
              <label for="bookmark-name-update">Update name: </label> 
              <input type="text" name="title" id="js-bookmark-name-update" value="${bookmark.title}">    
          </div>
          <hr>
          <div class="input-group">
          <p>Update Rating</p><select for="rating-update" name ="rating" class ="js-bookmark-rating-update">
            <option>${bookmark.rating}</option>
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
            <input type="text" name="desc" class="js-bookmark-description-update" value="${bookmark.desc}">
          </div>
        <hr>
        <div class="input-group">
            <label for="bookmark-url-entry">Update URL address: </label> 
            <input type="text" name="url" id="js-bookmark-url-entry" value="${bookmark.url}">                
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
      </form>
      </li>`;
  }

  function generateItemElement(item) {
    const expandedClass = store.items.expanded ? 'js-item-element-expanded' : '';
    const updatingClass = store.items.updating ? 'js-item-element-updating' : '';
    let expandedContent = '<div class="bookmark-item-controls"></div';
    const noRatingYet = `<div class="bookmark-rating">Rating: ${item.rating}</div>`;

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


    if (item.rating === 'No rating yet...') {
      return `
                <li class="js-item-element" data-item-id="${item.id}">
                <header role="banner">
                  ${itemTitle}
                      ${noRatingYet}
                    <form class="description-expansion">
                      <button class="submit" id="details-button">View Details</button>
                    </form>
                  </header>
                  ${expandedContent}
                </li>`;

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
              <option selected disabled>Choose a Rating</option>
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

    console.log(store.filterRating)
    
    if (store.addingBookmark) {
      return $('.create-new-bookmark').html(generateNewBookmarkHTML);
    }

    if (store.filterRating) {
      bookmarks = store.items.filter(bookmark => bookmark.rating >= store.filterRating && typeof bookmark.rating === 'number');
      const bookmarkListItemsString = generateBookmarkItemsString(bookmarks);
      return $('.js-bookmark-list').html(bookmarkListItemsString);
    } 
    
    if (store.updatingBookmark) {
      // const bookmark = store.items.filter(bookmark => bookmark.isUpdating);
      const updatedBookmark = generateItemUpdate(store.bookmarkToUpdate);
      return $('.js-bookmark-list').html(updatedBookmark);
    }

    
    
    $('.js-create-bookmark-form').remove();
    const bookmarkListItemsString = generateBookmarkItemsString(bookmarks);
    return $('.js-bookmark-list').html(bookmarkListItemsString);
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
      // const title = $(event.target).find('[name="bookmark-name-entry"]').val();
      // const url = $(event.target).find('[name="bookmark-url-entry"]').val();
      // let desc = $(event.target).find('[name="bookmark-description-entry"]').val();
      // desc === '' ? desc = 'no description yet...' : desc;
      console.log($(event.target))
      let newBookmark = $(event.target).serializeJson();
      // let rating = $(event.target).find('[name="bookmark-rating-entry"] option:selected').val();
      // console.log(rating);
      // if (rating !== 'Choose a Rating') {
      //   newBookmark.rating = rating;
      // }

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
      console.log(expandedBookmark)
      expandedBookmark.expanded = !expandedBookmark.expanded;
      render();
      $('.description-expansion').toggle();
    });
  }

  function handleUpdateButtonClicked() {
    $('.js-bookmark-list').on('submit', '.bookmark-item-update', event => {
      event.preventDefault();
      store.updatingBookmark = !store.updatingBookmark;
    
      const id = getIdFromBookmark(event.target);
      const bookmarkToUpdate = store.findById(id);
      store.bookmarkToUpdate = bookmarkToUpdate;
      console.log(store.bookmarkToUpdate);


      
      // const id = getIdFromBookmark(event.target);
      // console.log(`This is the id of the book mark to be updated: ${id}`);
      // const updatingBookmark = store.findById(id);
      // console.log(`This should the be the actual bookmark object of that id:  ${updatingBookmark}`);
      render();
      //pass editing property to store
      //render the page with all properties now input fields
      //enter all day
      //run create items again??
      
    });

  }

  function saveUpdatedBookmark() {
    $('.js-bookmark-list').on('submit', '.js-item-update-form', event=> {
      event.preventDefault();
      // const id = getIdFromBookmark(event.target);
      // console.log(event.target);
      // const title = $(event.target).find('[name="bookmark-name-entry"]').val();
      // console.log(title);
      // const url = $(event.target).find('[name="bookmark-url-entry"]').val();
      // console.log(url);
      // let desc = $(event.target).find('[name="bookmark-description-entry"]').val();
      // desc === '' ? desc = 'no description yet...' : desc;
      // console.log(desc);
      // let rating = $(event.target).find('[name="bookmark-rating-entry"] option:selected').val();
      // rating === '' ? rating = 'no rating yet...' : rating;
      // console.log(rating);


      store.addingBookmark = false;
      const updatedBookmark = $(event.target).serializeJson();
      console.log($(event.target))
      console.log('me?', updatedBookmark)
      api.updateBookmark(store.bookmarkToUpdate.id, updatedBookmark,
        () => {
          store.findAndUpdate(store.bookmarkToUpdate.id, updatedBookmark);
          store.setBookmarkIsUpdating(store.bookmarkToUpdate.id, false);
          store.bookmarkToUpdate = '';
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
      if (filterSetting === '0') {
        console.log('hi')
        render();
      }
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
    handleUpdateButtonClicked();
    saveUpdatedBookmark();
  }

  return {
    bindEventListeners,
    render,
  };

}() );