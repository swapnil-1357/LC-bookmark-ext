// // content.js
// // Author:
// // Author URI: https://
// // Author Github URI: https://www.github.com/
// // Project Repository URI: https://github.com/
// // Description: Handles all the webpage level activities (e.g. manipulating page data, etc.)
// // License: MIT
// const bookmarkURL = chrome.runtime.getURL("assets/bookmark.png");
// const AZ_PROBLEM_KEY = "AZ_PROBLEM_KEY"
// // window.addEventListener("load", addBookmarkButton);

// const observer = new MutationObserver(() => {
//     addBookmarkButton();
// })
// if(document.body){
//     observer.observe(document.body, { childList: true, subtree: true });

// }
// // observer.observe(document.boby,{childList: true, subtree: true });
// addBookmarkButton();

// function onProblemsPage() {
//     return window.location.pathname.startsWith('/problems/');
// }




// function addBookmarkButton() {

//     if (!onProblemsPage() || document.getElementById("add-bookmark-button")) return;

//     const bookmarkButton = document.createElement('img');
//     bookmarkButton.id = "add-bookmark-button";
//     bookmarkButton.src = bookmarkURL;
//     bookmarkButton.style.height = "30px";
//     bookmarkButton.style.width = "30px";
//     // bookmarkButton.style.cursor = "pointer";
//     // bookmarkButton.style.marginLeft = "auto";

//     const targetDiv = document.getElementsByClassName("coding_nav_bg__HRkIn")[0];
//     if (targetDiv) {
//         targetDiv.insertAdjacentElement("afterend", bookmarkButton);

//     }
//     else {
//         console.warn("error")
//     }
//     bookmarkButton.addEventListener("click", addNewBookmarkHandler);


// }

// async function addNewBookmarkHandler() {

//     const currentBookmarks = await getCurrentBookmarks();
//     const azProblemUrl = window.location.href;
//     const uniqueId = extractUniqueId(azProblemUrl);
//     const problemName = document.getElementsByClassName("Header_resource_heading__cpRp1")[0].innerText;

//     // this will run on  every bookmark if this will return true then if(ture) and nothing happend means the question is already there;
//     if (currentBookmarks.some((bookmark) => bookmark.id === uniqueId)) return;

//     const bookmarkObj = {
//         id: uniqueId,
//         name: problemName,
//         url: azProblemUrl

//     }

//     const updatedBookmarks = [...currentBookmarks, bookmarkObj];

//     chrome.storage.sync.set({ AZ_PROBLEM_KEY: updatedBookmarks }, () => {
//         // console.log("updated the bookmarks correctly to ", updatedBookmarks);
//     })


// }



// function extractUniqueId(url) {
//     const keyword = "problems/";
//     const start = url.indexOf(keyword);
//     // if (start === -1) return null;

//     const from = start + keyword.length;
//     const to = url.indexOf("?", from);
//     return to !== -1 ? url.substring(from, to) : url.substring(from);
// }

// function getCurrentBookmarks() {
//     return new Promise((resolve, reject) => {

//         chrome.storage.sync.get([AZ_PROBLEM_KEY], (results) => {

//             resolve(results[AZ_PROBLEM_KEY] || []);
//         })
//     })

// }


// // content.js
// // Author:
// // Author URI: https://
// // Author Github URI: https://www.github.com/
// // Project Repository URI: https://github.com/
// // Description: Handles all the webpage level activities (e.g. manipulating page data, etc.)
// // License: MIT
// const bookmarkURL = chrome.runtime.getURL("assets/bookmark.png");
// const LC_PROBLEM_KEY = "LC_PROBLEM_KEY"
// // window.addEventListener("load", addBookmarkButton);

// const observer = new MutationObserver(() => {
//     addBookmarkButton();
// })
// if (document.body) {
//     observer.observe(document.body, { childList: true, subtree: true });

// }
// // observer.observe(document.boby,{childList: true, subtree: true });
// addBookmarkButton();

// function onProblemsPage() {
//     return window.location.pathname.startsWith('/problems/');
// }




// function addBookmarkButton() {

//     if (!onProblemsPage() || document.getElementById("add-bookmark-button")) return;

//     const bookmarkButton = document.createElement('img');
//     bookmarkButton.id = "add-bookmark-button";
//     bookmarkButton.src = bookmarkURL;
//     bookmarkButton.style.height = "30px";
//     bookmarkButton.style.width = "30px";
//     // bookmarkButton.style.cursor = "pointer";
//     // bookmarkButton.style.marginLeft = "auto";

//     const targetDiv = document.getElementsByClassName("items-start")[0];
//     if (targetDiv) {
//         targetDiv.insertAdjacentElement("afterend", bookmarkButton);

//     }
//     else {
//         console.warn("error")
//     }
//     bookmarkButton.addEventListener("click", addNewBookmarkHandler);


// }

// async function addNewBookmarkHandler() {

//     const currentBookmarks = await getCurrentBookmarks();
//     const LCProblemUrl = window.location.href;
//     const uniqueId = extractUniqueId(LCProblemUrl);
//     const problemName = document.getElementsByClassName("items-start")[0].innerText;

//     // this will run on  every bookmark if this will return true then if(ture) and nothing happend means the question is already there;
//     if (currentBookmarks.some((bookmark) => bookmark.id === uniqueId)) return;

//     const bookmarkObj = {
//         id: uniqueId,
//         name: problemName,
//         url: LCProblemUrl

//     }

//     const updatedBookmarks = [...currentBookmarks, bookmarkObj];

//     chrome.storage.sync.set({ LC_PROBLEM_KEY: updatedBookmarks }, () => {
//         // console.log("updated the bookmarks correctly to ", updatedBookmarks);
//     })


// }



// function extractUniqueId(url) {
//     const keyword = "problems/";
//     const start = url.indexOf(keyword);
//     // if (start === -1) return null;

//     const from = start + keyword.length;
//     const to = url.indexOf("?", from);
//     return to !== -1 ? url.substring(from, to) : url.substring(from);
// }

// function getCurrentBookmarks() {
//     return new Promise((resolve, reject) => {

//         chrome.storage.sync.get([LC_PROBLEM_KEY], (results) => {

//             resolve(results[LC_PROBLEM_KEY] || []);
//         })
//     })

// }



// content.js
// Author:
// Author URI: https://
// Author Github URI: https://www.github.com/
// Project Repository URI: https://github.com/
// Description: Handles all the webpage level activities (e.g. manipulating page data, etc.)
// License: MIT

const bookmarkURL = chrome.runtime.getURL("assets/bookmark.png");
const LC_PROBLEM_KEY = "LC_PROBLEM_KEY";

const observer = new MutationObserver(() => {
    addBookmarkButton();
});
if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
}
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
    bookmarkButton.style.cursor = "pointer";

    const targetDiv = document.getElementsByClassName("items-start")[0];
    if (targetDiv) {
        targetDiv.insertAdjacentElement("afterend", bookmarkButton);
    } else {
        console.warn("Target element not found");
    }

    bookmarkButton.addEventListener("click", addNewBookmarkHandler);
}

async function addNewBookmarkHandler() {
    const currentBookmarks = await getCurrentBookmarks();
    const LCProblemUrl = window.location.href;
    const uniqueId = extractUniqueId(LCProblemUrl);
    const problemName = document.getElementsByClassName("items-start")[0]?.innerText || "Untitled";

    if (currentBookmarks.some((bookmark) => bookmark.id === uniqueId)) return;

    showImportancePopup((importance, difficulty) => {
        const bookmarkObj = {
            id: uniqueId,
            name: problemName,
            url: LCProblemUrl,
            importance,
            difficulty,
            timestamp: new Date().toISOString()
        };

        const updatedBookmarks = [...currentBookmarks, bookmarkObj];
        chrome.storage.sync.set({ [LC_PROBLEM_KEY]: updatedBookmarks }, () => {
            console.log("Bookmark saved:", bookmarkObj);
        });
    });
}

function extractUniqueId(url) {
    const keyword = "problems/";
    const start = url.indexOf(keyword);
    const from = start + keyword.length;
    const to = url.indexOf("?", from);
    return to !== -1 ? url.substring(from, to) : url.substring(from);
}

function getCurrentBookmarks() {
    return new Promise((resolve) => {
        chrome.storage.sync.get([LC_PROBLEM_KEY], (results) => {
            resolve(results[LC_PROBLEM_KEY] || []);
        });
    });
}

function showImportancePopup(callback) {
    const existing = document.getElementById("importance-popup");
    if (existing) existing.remove();

    const popup = document.createElement("div");
    popup.id = "importance-popup";
    popup.style.position = "fixed";
    popup.style.top = "50%";
    popup.style.left = "50%";
    popup.style.transform = "translate(-50%, -50%)";
    popup.style.background = "#fff";
    popup.style.border = "1px solid #ccc";
    popup.style.borderRadius = "12px";
    popup.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)";
    popup.style.padding = "16px";
    popup.style.zIndex = "9999";
    popup.style.textAlign = "center";

    const msg = document.createElement("div");
    msg.textContent = "Select importance & difficulty:";
    msg.style.marginBottom = "12px";
    msg.style.fontSize = "14px";
    msg.style.fontWeight = "600";
    popup.appendChild(msg);

    const difficulties = ["Easy", "Medium", "Hard"];
    const selected = { difficulty: "Easy", importance: "Low" };

    const selectDifficulty = document.createElement("select");
    difficulties.forEach(diff => {
        const opt = document.createElement("option");
        opt.value = diff;
        opt.textContent = diff;
        selectDifficulty.appendChild(opt);
    });
    selectDifficulty.onchange = (e) => selected.difficulty = e.target.value;
    selectDifficulty.style.marginBottom = "10px";
    popup.appendChild(selectDifficulty);

    const levels = [
        { label: "🟢 Low", value: "Low", color: "#2ecc71" },
        { label: "🟠 Medium", value: "Medium", color: "#e67e22" },
        { label: "🔴 High", value: "High", color: "#e74c3c" }
    ];

    levels.forEach(level => {
        const btn = document.createElement("button");
        btn.textContent = level.label;
        btn.style.margin = "4px";
        btn.style.padding = "6px 12px";
        btn.style.border = "none";
        btn.style.borderRadius = "6px";
        btn.style.backgroundColor = level.color;
        btn.style.color = "#fff";
        btn.style.cursor = "pointer";
        btn.style.fontWeight = "bold";
        btn.onclick = () => {
            popup.remove();
            selected.importance = level.value;
            callback(selected.importance, selected.difficulty);
        };
        popup.appendChild(btn);
    });

    document.body.appendChild(popup);
}
