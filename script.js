const modal = document.getElementById('modal');
const modalShow = document.getElementById('show-modal');
const modalClose = document.getElementById('close-modal');
const bookmarkForm = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainer = document.getElementById('bookmarks-container');

let bookmarks = {};

// Show modal, focus on input
function showModal() {
    modal.classList.add('show-modal');
    websiteNameEl.focus();
}

// Modal event listeners 
modalShow.addEventListener('click', showModal);
modalClose.addEventListener('click', () => modal.classList.remove('show-modal'));
window.addEventListener('click', (e) => (e.target === modal ? modal.classList.remove('show-modal') : false) )

// Validate form with regular expression
function validate(nameValue, urlValue) {
    const expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
    const regex = new RegExp(expression);
    if(!nameValue || !urlValue) {
        alert('Please submit values for both fields correctly.');
        return false;
    }
    if(!urlValue.match(regex)) {
        alert('Please provide a valid web address');
        return false;
    }
    // Valid
    return true;
}

// Build bookmarks in the DOM
function buildBookmarks() {
    // Remove All bookmark elements before forEach
    bookmarksContainer.textContent = '';
    // Build items
    Object.keys(bookmarks).forEach((id) => {
      const { name, url} = bookmarks[id];
      // Item
      const item = document.createElement('div');
      item.classList.add('item');
      // Close icon
      const closeIcon = document.createElement('i');
      closeIcon.classList.add('fas', 'fa-times-circle');
      closeIcon.setAttribute('title', 'Delete bookmark!');
      closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`);
      // Favicon / Link container
      const linkInfo = document.createElement('div');
      linkInfo.classList.add('name');
      // Favicon
      const favicon = document.createElement('img');
      favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
      favicon.setAttribute('alt', 'favicon');
      // Link
      const link = document.createElement('a');
      link.setAttribute('href', `${url}`);
      link.setAttribute('target', '_blank');
      link.textContent = name;
      // Append to ookmarks container
      linkInfo.append(favicon, link);
      item.append(closeIcon, linkInfo);
      bookmarksContainer.appendChild(item);
    });
}

// Delete bookmark
function deleteBookmark(id){
    console.log(id);
       if(bookmarks[id]){
          delete bookmarks[id];
   };
   // Update bookmarks array in localStorage, re-populate DOM
   localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
   fetchBookmarks();
}

// Fetch bookmarks
function fetchBookmarks(){
    // Get bookmarks from localStorage if available
    if(localStorage.getItem('bookmarks')) {
        bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    } else {
        // Create bookmarks array in localStorage
        const id = `https://github.com/asyr01`
        bookmarks[id] = {
                name: 'Ali Sayar',
                url: 'https://github.com/asyr01',
            }

        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }
    buildBookmarks();
}

// Handle data from form
function storeBookmark(e) {
    e.preventDefault();
    const nameValue = websiteNameEl.value;
    let urlValue = websiteUrlEl.value;
    if(!urlValue.includes('http://', 'https://')) {
        urlValue = `https://${urlValue}`;
    }
    if(!validate(nameValue, urlValue)) {
        return false;
    }
    const bookmark = {
        name: nameValue,
        url: urlValue,
    };
    bookmarks.push(bookmark);
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
    bookmarkForm.reset();
    websiteNameEl.focus();
}

// Event Listener
bookmarkForm.addEventListener('submit', storeBookmark);

// On Load, Fetch Bookmarks.
   fetchBookmarks();