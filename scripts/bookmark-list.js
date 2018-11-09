'use strict';
/*global store, api */

const bookmarkList = (function() {

  // function generateError(err) {
  //   let message = '';
  //   if (err.responseJSON && err.responseJSON.message) {
  //     message = err.responseJSON.message;
  //   } else {
  //     message = `${err.code} Server Error`; 
  //   }

  //   return `
  //     <section class="error-content">
  //       <button id="cancel-error">X</button>
  //       <p>${message}</p>
  //     </section>
  //   `;

  // }

  function generateItemElement(item) {
    const expandedClass = store.items.expanded ? 'js-item-element-expanded' : '';
    let expandedContent = '<div class="bookmark-item-controls"></div';

    let itemTitle = `<span class="bookmark-item ${expandedClass}"><h2>${item.title}</h2></span>`;

    if (item.expanded) { 
      expandedContent = `<div class="bookmark-item-controls">
      <div class="bookmark-item-url">
        <p>url: ${item.url}</p>
      </div>
      <div class="bookmark-item-description">
        <p> ${item.description}
        </p>
      </div>
      <button class="bookmark-item-delete js-item-delete">
        <span class="button-label">Remove this bookmark</span>
      </button>
    </div>`;
    }

    return `
              <li class="js-item-element" data-item-id="${item.id}">
              <header role="banner">
                ${itemTitle}
                    <div class="bookmark-rating">${item.rating}</div>
                  </div>
                </header>
                ${expandedContent}
              </li>`;
  }

  function generateBookmarkItemsString(bookmarksList) {
    const items = bookmarksList.map((item) => generateItemElement(item));
    console.log('hello from generateBookmarkItemsString function');
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
            <label for="bookmark-name-entry">Bookmark Name</label> 
            <input type="text" name="bookmark-name-entry" id="js-bookmark-name-entry" placeholder="Required Field">    
          </div>
            <div class="input-group">
              <label for="bookmark-url-entry">url address:</label> 
              <input type="text" name="bookmark-url-entry" id="js-bookmark-url-entry" placeholder="Required Field">                
          </div>
          <div class="input-group">
            <label for="bookmark-description-entry">Bookmark description:</label> 
            <input type="text" name="bookmark-description-entry" class="js-bookmark-description-entry" placeholder="Optional">
          </div>
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
    // if (store.error) {
    //   const el = generateError(store.error);
    //   $('.error-container').html(el);
    // } else {
    //   $('.error-container').empty();
    // }

    console.log('render ran');
    console.log(`${store.addingBookmark}`);

    let bookmarks = [...store.items];

    
    if (store.addingBookmark) {
      console.log('in the "addingBookmark" if block')
      $('.create-new-bookmark').html(generateNewBookmarkHTML);
    } else { 
      console.log('in the "regular" render block')
      // $('.create-new-bookmark').toggle();
      const bookmarkListItemsString = generateBookmarkItemsString(bookmarks);
      $('.js-bookmark-list').html(bookmarkListItemsString);
    }
  }

  function handleNewItemClicked() {
    // event listener for add new item button
    $('#js-bookmark-list-form').click(event => {
      event.preventDefault();
      console.log('add button pressed');
      store.addingBookmark = true;
      // $('.create-new-bookmark').attr('hidden', 'false')
      console.log(store.addingBookmark);
      render();
    });
  }

  // function renderAddBookmarkHTML() {
  //   if(store.addingBookmark){
  //     $('.js-create-bookmark-form').html(generateNewBookmarkHTML());
  //   }
  //   else{
  //     $('.js-create-bookmark-form').html('');
  //   }
  // }

  const handleCreateBookmark = function(){
    //event listener for submit new bookmark button
    $('.create-new-bookmark').on('submit', event => {
      event.preventDefault();
      const title = $(event.target).find('[name="bookmark-name-entry"]').val();
      const url = $(event.target).find('[name="bookmark-url-entry"]').val();
      let desc = $(event.target).find('[name="bookmark-description-entry"]').val();
      desc === '' ? desc = 'no description yet...' : desc;
      let rating = $(event.target).find('[name="bookmark-rating-entry"] option:selected').val();
      console.log(`new button clicked`);
      rating === '' ? rating = 'no rating yet...' : rating;
      store.addingBookmark = false;
      let newBookmark = { title: title, url: url, desc: desc, rating: rating };
      api.addBookmark(newBookmark, 
        (data) => {
          store.addItem(data);
          $('.create-new-bookmark').attr('hidden');
          render();
        },
        (err) => {
          console.log(err);
          store.setError(err);
          render();
        }
      );
      // store.createItem(name, url, desc, rating);
      // console.log(store.items);
      // // renderAddBookmarkHTML();
      // render();
    });
  };

  // generateError();
  // generateItemElement();
  // generateBookmarkItemsString();
  // generateNewBookmarkHTML();

  function handleExpandBookmark(){
    $('.js-bookmark-list').on('click', '.js-item-element', event => {
      console.log('expand clicked');
      console.log(event.target)
      const id = getIdFromBookmark(event.target);
      const expandedBookmark = store.findById(id)
      expandedBookmark.expanded = !expandedBookmark.expanded;
      render();
      // const expandedItem = store.findById(id);
      // expandedItem['expanded'] = true;

    });
  }

  function handleDeleteButtonClicked() {
    $('.js-bookmark-list').on('click', '.bookmark-item-delete', event => {
      event.preventDefault();
      const id = getIdFromBookmark(event.target);
      console.log(id)
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
      $('.create-bookmark-form').attr('hidden="true"')
      render();
    });
  }

  function getIdFromBookmark(bookmark){
    return $(bookmark).closest('.js-item-element').data('item-id');
  }

  function bindEventListeners() {
    handleNewItemClicked();
    handleCreateBookmark();
    handleExpandBookmark();
    handleCancelNewBookmarkClicked();
    handleDeleteButtonClicked();
  }

  return {
    bindEventListeners: bindEventListeners,
    render: render,
    // renderAddBookmarkHTML: renderAddBookmarkHTML
  };

}() );