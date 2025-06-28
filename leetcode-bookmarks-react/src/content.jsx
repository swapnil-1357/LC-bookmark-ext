import React from "react";
import ReactDOM from "react-dom/client";
import InjectPopup from "./components/InjectPopup";

const mountId = "leetcode-injected-popup";
const iconId = "add-bookmark-icon";
const LC_PROBLEM_KEY = "LC_PROBLEM_KEY";

// Avoid double-inject
if (!document.getElementById(mountId)) {
    const mount = document.createElement("div");
    mount.id = mountId;
    mount.style.position = "fixed";
    mount.style.top = "50%";
    mount.style.left = "50%";
    mount.style.transform = "translate(-50%, -50%)";
    mount.style.zIndex = "9999";
    mount.style.display = "none"; // Initially hidden
    document.body.appendChild(mount);

    const url = window.location.href;

    const handleSave = (bookmark) => {
        bookmark.id = url; // Ensure unique ID per problem
        chrome.storage.sync.get([LC_PROBLEM_KEY], (result) => {
            const existing = result[LC_PROBLEM_KEY] || [];
            const filtered = existing.filter(b => b.id !== bookmark.id);
            const updated = [...filtered, bookmark];
            chrome.storage.sync.set({ [LC_PROBLEM_KEY]: updated }, () => {
                alert("✅ Problem bookmarked!");
                console.log("Bookmarks now:", updated);
                const popup = document.getElementById(mountId);
                if (popup) popup.style.display = "none";
            });
        });
    };
      

    const root = ReactDOM.createRoot(mount);
    root.render(<InjectPopup url={url} onSave={handleSave} />);
}

// Insert the icon near LeetCode's problem title
const insertBookmarkIcon = () => {
    const container = document.querySelector(".items-start");
    if (!container || document.getElementById(iconId)) return;

    const img = document.createElement("img");
    img.id = iconId;
    img.src = chrome.runtime.getURL("assets/bookmark.png");
    img.style.width = "28px";
    img.style.height = "28px";
    img.style.marginLeft = "12px";
    img.style.cursor = "pointer";

    img.onclick = () => {
        const popup = document.getElementById(mountId);
        if (popup) popup.style.display = "block";
    };

    container.appendChild(img);
};

// Observe DOM changes in case React re-renders
const observer = new MutationObserver(() => insertBookmarkIcon());
if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
}
insertBookmarkIcon(); // Initial run
