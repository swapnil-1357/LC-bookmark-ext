import React from "react";
import ReactDOM from "react-dom/client";
import InjectPopup from "./components/InjectPopup";

const mountId = "leetcode-injected-popup";
const iconId = "add-bookmark-icon";
const LC_PROBLEM_KEY = "LC_PROBLEM_KEY";

// Utility: Extracts the question number from the LeetCode problem title
function getCurrentQuestionNumber() {
    const titleEl = document.querySelector('[data-cy="question-title"]') || document.querySelector('.text-title-large');
    if (!titleEl) return null;
    const match = titleEl.textContent.match(/^(\d+)\./);
    return match ? match[1] : null;
}

// Utility: Extracts the problem title
function getCurrentQuestionTitle() {
    const titleEl = document.querySelector('[data-cy="question-title"]') || document.querySelector('.text-title-large');
    return titleEl ? titleEl.textContent.trim() : "";
}

// Utility: Gets the current URL
function getCurrentQuestionUrl() {
    return window.location.href;
}

// Remove old icon and popup if present (for SPA navigation)
function cleanUpOld() {
    const oldIcon = document.getElementById(iconId);
    if (oldIcon) oldIcon.remove();
    const oldPopup = document.getElementById(mountId);
    if (oldPopup) {
        if (oldPopup._reactRootContainer) {
            ReactDOM.unmountComponentAtNode(oldPopup);
        }
        oldPopup.remove();
    }
}

let lastInjectedQuestion = null;

// Injects the popup and the bookmark icon for the current question
function injectPopupAndIcon() {
    const questionNumber = getCurrentQuestionNumber();
    if (!questionNumber) return;

    // Prevent duplicate injection for the same question
    if (lastInjectedQuestion === questionNumber) return;
    lastInjectedQuestion = questionNumber;

    cleanUpOld();

    // --- Icon ---
    const container = document.querySelector(".items-start");
    if (!container) return;

    const img = document.createElement("img");
    img.id = iconId;
    img.src = chrome.runtime.getURL("assets/bookmark.png");
    img.style.width = "28px";
    img.style.height = "28px";
    img.style.marginLeft = "12px";
    img.style.cursor = "pointer";

    // --- Popup ---
    const mount = document.createElement("div");
    mount.id = mountId;
    mount.style.position = "fixed";
    mount.style.top = "50%";
    mount.style.left = "50%";
    mount.style.transform = "translate(-50%, -50%)";
    mount.style.zIndex = "9999";
    mount.style.display = "none";
    document.body.appendChild(mount);

    // Get title and url for this question
    const title = getCurrentQuestionTitle();
    const url = getCurrentQuestionUrl();

    chrome.storage.sync.get([LC_PROBLEM_KEY], (result) => {
        const existing = result[LC_PROBLEM_KEY] || [];
        const alreadyBookmarked = existing.some(b => b.id === questionNumber);

        const handleSave = (bookmark) => {
            bookmark.id = questionNumber;
            bookmark.name = title;
            bookmark.url = url;
            bookmark.addedAt = new Date().toISOString();
            chrome.storage.sync.get([LC_PROBLEM_KEY], (result) => {
                const existing = result[LC_PROBLEM_KEY] || [];
                // Check by URL
                if (existing.some(b => b.url === url)) {
                    alert("This problem is already bookmarked!");
                    const popup = document.getElementById(mountId);
                    if (popup) popup.style.display = "none";
                    return;
                }
                const updated = [...existing, bookmark];
                chrome.storage.sync.set({ [LC_PROBLEM_KEY]: updated }, () => {
                    alert("✅ Problem bookmarked!");
                    const popup = document.getElementById(mountId);
                    if (popup) popup.style.display = "none";
                });
            });
        };

        const root = ReactDOM.createRoot(mount);
        root.render(
            <InjectPopup
                onSave={handleSave}
                problemName={title}
                url={url}
            />
        );

        img.onclick = () => {
            chrome.storage.sync.get([LC_PROBLEM_KEY], (result2) => {
                const existing2 = result2[LC_PROBLEM_KEY] || [];
                // Check by URL
                const isBookmarked = existing2.some(b => b.url === url);
                const popup = document.getElementById(mountId);
                if (isBookmarked) {
                    alert("This problem is already bookmarked!");
                    if (popup) popup.style.display = "none";
                } else {
                    if (popup) popup.style.display = "block";
                }
            });
        };

        container.appendChild(img);
    });
}

// Throttle observer to avoid rapid firing
let injectTimeout = null;
const observer = new MutationObserver(() => {
    if (injectTimeout) clearTimeout(injectTimeout);
    injectTimeout = setTimeout(() => {
        injectPopupAndIcon();
    }, 200);
});
if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true });
}
injectPopupAndIcon(); // Initial run