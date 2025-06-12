// content.js
// Author:
// Author URI: https://
// Author Github URI: https://www.github.com/
// Project Repository URI: https://github.com/
// Description: Handles all the webpage level activities (e.g. manipulating page data, etc.)
// License: MIT
const bookmarkURL = chrome.runtime.getURL("assets/bookmark.png");
const AZ_PROBLEM_KEY = "AZ_PROBLEM_KEY"
// window.addEventListener("load", addBookmarkButton);

const observer = new MutationObserver(() => {
    addBookmarkButton();
})
if(document.body){
    observer.observe(document.body, { childList: true, subtree: true });

}
// observer.observe(document.boby,{childList: true, subtree: true });
addBookmarkButton();

function onProblemsPage() {
    return window.location.pathname.startsWith('/problems/');
}




function addBookmarkButton() {

    if (!onProblemsPage() || document.getElementById("add-bookmark-button")) return;

    const bookmarkButton = document.createElement('img');
    bookmarkButton.id = "add-bookmark-button";
    bookmarkButton.src = bookmarkURL;
    bookmarkButton.style.height = "30px";
    bookmarkButton.style.width = "30px";
    // bookmarkButton.style.cursor = "pointer";
    // bookmarkButton.style.marginLeft = "auto";

    const targetDiv = document.getElementsByClassName("coding_nav_bg__HRkIn")[0];
    if (targetDiv) {
        targetDiv.insertAdjacentElement("afterend", bookmarkButton);

    }
    else {
        console.warn("error")
    }

    // console.log("hiii")
    bookmarkButton.addEventListener("click", addNewBookmarkHandler);


}

async function addNewBookmarkHandler() {
    console.log("hi");
    const currentBookmarks = await getCurrentBookmarks();
    const azProblemUrl = window.location.href;
    const uniqueId = extractUniqueId(azProblemUrl);
    const problemName = document.getElementsByClassName("Header_resource_heading__cpRp1")[0].innerText;

    // this will run on  every bookmark if this will return true then if(ture) and nothing happend means the question is already there;
    if (currentBookmarks.some((bookmark) => bookmark.id === uniqueId)) return;

    const bookmarkObj = {
        id: uniqueId,
        name: problemName,
        url: azProblemUrl

    }

    const updatedBookmarks = [...currentBookmarks, bookmarkObj];

    chrome.storage.sync.set({ AZ_PROBLEM_KEY: updatedBookmarks }, () => {
        console.log("updated the bookmarks correctly to ", updatedBookmarks);
    })


}



function extractUniqueId(url) {
    const keyword = "problems/";
    const start = url.indexOf(keyword);
    // if (start === -1) return null;

    const from = start + keyword.length;
    const to = url.indexOf("?", from);
    return to !== -1 ? url.substring(from, to) : url.substring(from);
}

function getCurrentBookmarks() {
    return new Promise((resolve, reject) => {

        chrome.storage.sync.get([AZ_PROBLEM_KEY], (results) => {
            // console.log(results)
            resolve(results[AZ_PROBLEM_KEY] || []);
        })
    })

}

