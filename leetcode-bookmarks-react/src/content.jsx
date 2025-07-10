import React from "react";
import ReactDOM from "react-dom/client";
import InjectPopup from "./components/InjectPopup";
import { showToast } from "./components/helper/toast";
import NotesModal from "./components/NotesModal";

const mountId = "leetcode-injected-popup";
const iconId = "add-bookmark-icon";
const LC_PROBLEM_KEY = "LC_PROBLEM_KEY";

let lastInjectedQuestion = null;
let reactRoot = null;
let notesModalRoot = null;
let notesModalReactRoot = null;

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

// Fetch LeetCode metadata (acceptance + topics)
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
    try {
        const response = await fetch("https://leetcode.com/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query, variables: { titleSlug: slug } })
        });
        const json = await response.json();

        if (json.errors || !json.data?.question) {
            return { acceptanceRate: "N/A", topics: [] };
        }

        const stats = JSON.parse(json.data.question.stats || "{}");

        return {
            acceptanceRate: stats.acRate || "N/A",
            topics: Array.isArray(json.data.question.topicTags)
                ? json.data.question.topicTags.map(tag => tag.name)
                : []
        };
    } catch (err) {
        console.error("Meta fetch error:", err);
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

async function injectPopupAndIcon() {
    const qNum = getCurrentQuestionNumber();
    if (!qNum || lastInjectedQuestion === qNum) return;

    lastInjectedQuestion = qNum;
    cleanUpOld();

    const container = document.querySelector(".items-start");
    if (!container) return;

    const url = getCurrentQuestionUrl();
    const title = getCurrentQuestionTitle();
    const slug = url.split("/problems/")[1]?.split("/")[0]?.split("?")[0];

    const meta = await fetchProblemMeta(slug);

    const img = document.createElement("img");
    img.id = iconId;
    img.src = chrome.runtime.getURL("assets/bookmark.png");
    Object.assign(img.style, {
        width: "28px",
        height: "28px",
        marginLeft: "12px",
        cursor: "pointer"
    });
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

// Mount modal on problem page
function openNotesModal(problemId) {
    if (notesModalRoot) {
        notesModalReactRoot.unmount();
        notesModalRoot.remove();
        notesModalReactRoot = null;
        notesModalRoot = null;
        return;
    }

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

// Set up observer for SPA navigation
const observer = new MutationObserver(() => {
    injectPopupAndIcon();
});
observer.observe(document.body, { childList: true, subtree: true });
injectPopupAndIcon(); // Run once on initial load

// Listen for messages (note modal + tag click)
chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "OPEN_LEETCODE_NOTE_MODAL" && msg.problemId) {
        openNotesModal(msg.problemId);
    }

    if (msg.type === "FETCH_LEETCODE_TOPIC_PROBLEMS" && msg.topicSlug) {
        const topicUrl = `https://leetcode.com/problem-list/${msg.topicSlug}`;
        window.open(topicUrl, "_blank");
    }
});
