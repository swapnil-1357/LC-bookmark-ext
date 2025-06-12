// content.js
// Author:
// Author URI: https://
// Author Github URI: https://www.github.com/
// Project Repository URI: https://github.com/
// Description: Handles all the webpage level activities (e.g. manipulating page data, etc.)
// License: MIT
const bookmarkURL = chrome.runtime.getURL("assets/bookmark.png");

window.addEventListener("load", addBookmarkButton);

function addBookmarkButton() {
    const bookmarkButton = document.createElement('img');
    bookmarkButton.id = "add-bookmark-button";
    bookmarkButton.src = bookmarkURL;
    bookmarkButton.style.height = "30px";
    bookmarkButton.style.width = "30px";
    bookmarkButton.style.cursor = "pointer";
    bookmarkButton.style.marginLeft = "auto";

    const targetDiv = document.getElementsByClassName("coding_nav_bg__HRkIn")[0];
    const elements = document.getElementsByClassName("items-start")[0];
    if (elements) {
        elements.style.display = "flex";
        elements.appendChild(bookmarkButton);
    } else {
        console.warn("Target div not found");
    }
    if (targetDiv) {
        targetDiv.style.display = "flex"; 
        targetDiv.appendChild(bookmarkButton);
    } else {
        console.warn("Target div not found");
    }

    
}

