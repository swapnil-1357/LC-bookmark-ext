import React from "react";
import ReactDOM from "react-dom/client";
import InjectPopup from "./components/InjectPopup";
import { showToast } from "./components/helper/toast";
import NotesModal from "./components/NotesModal";

const mountId = "leetcode-injected-popup";
const iconId = "add-bookmark-icon";
const LC_PROBLEM_KEY = "LC_PROBLEM_KEY";

function getCurrentQuestionNumber() {
    const titleEl = document.querySelector('[data-cy="question-title"]') || document.querySelector('.text-title-large');
    if (!titleEl) return null;
    const match = titleEl.textContent.match(/^(\d+)\./);
    return match ? match[1] : null;
}

function getCurrentQuestionTitle() {
    const titleEl = document.querySelector('[data-cy="question-title"]') || document.querySelector('.text-title-large');
    return titleEl ? titleEl.textContent.trim() : "";
}

function getCurrentQuestionUrl() {
    return window.location.href;
}

// Fetches acceptance rate and topics from LeetCode GraphQL API
async function fetchProblemMeta(slug) {
    const query = `
    query getQuestionDetail($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        titleSlug
        stats
        topicTags {
          name
        }
      }
    }
  `;
    console.log("Fetching meta for slug:", slug);
    try {
        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, variables: { titleSlug: slug } })
        });
        const json = await response.json();
        console.log("LeetCode API response:", json);

        if (json.errors) {
            console.error("LeetCode API error:", json.errors);
            return { acceptanceRate: "N/A", topics: [] };
        }

        const { data } = json;
        if (!data?.question) {
            console.warn("No question data found for slug:", slug);
            return { acceptanceRate: "N/A", topics: [] };
        }
        console.log("data.question:", data.question);
        if (!data.question.stats) {
            console.warn("No stats found in question data:", data.question);
            return { acceptanceRate: "N/A", topics: [] };
        }
        const stats = JSON.parse(data.question.stats);
        console.log("Parsed stats:", stats);
        return {
            acceptanceRate: stats.acRate || "N/A",
            topics: Array.isArray(data.question.topicTags)
                ? data.question.topicTags.map(tag => tag.name)
                : []
        };
    } catch (err) {
        console.error("Fetch error:", err);
        return { acceptanceRate: "N/A", topics: [] };
    }
}

function cleanUpOld() {
    const oldIcon = document.getElementById(iconId);
    if (oldIcon) oldIcon.remove();
    const oldPopup = document.getElementById(mountId);
    if (oldPopup) {
        if (reactRoot) {
            reactRoot.unmount();
            reactRoot = null;
        }
        oldPopup.remove();
    }
}

let lastInjectedQuestion = null;
let reactRoot = null;

async function injectPopupAndIcon() {
    const qNum = getCurrentQuestionNumber();
    if (!qNum) return;

    // Only re-inject if the question changed
    if (lastInjectedQuestion !== qNum) {
        lastInjectedQuestion = qNum;
        cleanUpOld();

        const container = document.querySelector(".items-start");
        if (!container) return;

        const img = document.createElement("img");
        img.id = iconId;
        img.src = chrome.runtime.getURL("assets/bookmark.png");
        img.style.width = "28px";
        img.style.height = "28px";
        img.style.marginLeft = "12px";
        img.style.cursor = "pointer";
        container.appendChild(img);

        const mount = document.createElement("div");
        mount.id = mountId;
        Object.assign(mount.style, {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: "9999",
            display: "none"
        });
        document.body.appendChild(mount);

        const url = getCurrentQuestionUrl();
        const title = getCurrentQuestionTitle();
        // FIX: Extract only the slug, not the query string
        const slug = url.split("/problems/")[1]?.split("/")[0]?.split("?")[0];

        const meta = await fetchProblemMeta(slug);
        console.log("InjectPopup meta:", meta);

        const handleSave = (bookmark) => {
            bookmark.id = qNum;
            bookmark.name = title;
            bookmark.url = url;
            bookmark.acceptanceRate = meta.acceptanceRate;
            bookmark.topics = meta.topics;
            bookmark.addedAt = new Date().toISOString();

            chrome.storage.sync.get([LC_PROBLEM_KEY], (res) => {
                const existing = res[LC_PROBLEM_KEY] || [];
                if (existing.some(b => b.url === url)) {
                    showToast("Already bookmarked!");
                    return;
                }
                chrome.storage.sync.set({ [LC_PROBLEM_KEY]: [...existing, bookmark] }, () => {
                    showToast("✅ Problem bookmarked!");
                    mount.style.display = "none";
                });
            });
        };

        reactRoot = ReactDOM.createRoot(mount);
        reactRoot.render(<InjectPopup
            onSave={handleSave}
            problemName={title}
            url={url}
            acceptanceRate={meta.acceptanceRate}
            topics={meta.topics}
        />);

        img.onclick = () => {
            chrome.storage.sync.get([LC_PROBLEM_KEY], (res) => {
                const existing = res[LC_PROBLEM_KEY] || [];
                if (existing.some(b => b.url === url)) {
                    showToast("Already bookmarked!");
                    return;
                }
                mount.style.display = mount.style.display === "block" ? "none" : "block";
            });
        };
    }
}

const observer = new MutationObserver(() => {
    injectPopupAndIcon();
});
observer.observe(document.body, { childList: true, subtree: true });

// Also, run once on load
injectPopupAndIcon();

// Function to inject NotesModal into LeetCode page
let notesModalRoot = null;
let notesModalReactRoot = null;

function openNotesModal(problemId) {
    // If already open, toggle off (close and remove)
    if (notesModalRoot) {
        notesModalReactRoot.unmount();
        notesModalRoot.remove();
        notesModalReactRoot = null;
        notesModalRoot = null;
        return;
    }

    // Otherwise, create and render it
    notesModalRoot = document.createElement("div");
    notesModalRoot.id = "leetcode-notes-modal-root";
    document.body.appendChild(notesModalRoot);

    notesModalReactRoot = ReactDOM.createRoot(notesModalRoot);
    notesModalReactRoot.render(
        <NotesModal
            problemId={problemId}
            onClose={() => {
                notesModalReactRoot.unmount();
                notesModalRoot.remove();
                notesModalReactRoot = null;
                notesModalRoot = null;
            }}
        />
    );
}

// Listen for messages from the popup
if (window.chrome && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
        if (msg.type === "OPEN_LEETCODE_NOTE_MODAL" && msg.problemId) {
            openNotesModal(msg.problemId);
        }
    });
}
