import React, { useState } from "react";
import play from "../assets/play.png";
import del from "../assets/delete.png";
import note from "../assets/note.png";
import copy from "../assets/copy.png";
import { showToast } from "./helper/toast";

export default function BookmarkCard({ bookmark, onDelete, onCopy, dark }) {
    const [showTopics, setShowTopics] = useState(false);

    const openInNewTab = () => {
        if (chrome?.tabs?.create) {
            chrome.tabs.create({ url: bookmark.url });
        } else {
            window.open(bookmark.url, "_blank");
        }
    };

    const openTopicPage = (topicName) => {
        const slug = topicName.toLowerCase().replace(/\s+/g, "-");
        const tagUrl = `https://leetcode.com/problem-list/${slug}/`;

        if (chrome?.tabs?.create) {
            chrome.tabs.create({ url: tagUrl });
        } else {
            window.open(tagUrl, "_blank");
        }
    };
    

    const importanceColors = {
        High: "#e74c3c",
        Medium: "#f39c12",
        Low: "#2ecc71"
    };

    const difficultyColors = {
        Easy: "#2ecc71",
        Medium: "#f39c12",
        Hard: "#e74c3c"
    };

    return (
        <div className="bookmark-card-animated">
            <div style={{
                border: dark ? "1px solid #444" : "1px solid #ccc",
                borderRadius: "14px",
                marginBottom: "8px",
                backgroundColor: dark ? "#232946" : "#fff",
                color: dark ? "#f4f4f4" : "#222",
                boxShadow: dark
                    ? "0 4px 12px rgba(0,0,0,0.32)"
                    : "0 4px 12px rgba(0,0,0,0.12)",
                minHeight: "60px",
                minWidth: "320px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                transition: "background 0.2s, color 0.2s, border 0.2s"
            }}>
                <div style={{
                    fontWeight: "600",
                    fontSize: "16px",
                    padding: "8px",
                    marginBottom: "4px",
                    color: dark ? "#e0e6f7" : "#111827"
                }}>{bookmark.name}</div>

                <div style={{
                    marginBottom: "2px",
                    padding: "8px",
                    fontSize: "14px",
                    color: dark ? "#bdbddd" : "#555"
                }}>
                    <span style={{ color: importanceColors[bookmark.importance] }}>
                        {bookmark.importance}
                    </span>
                    {" - "}
                    <span style={{ color: difficultyColors[bookmark.difficulty] }}>
                        {bookmark.difficulty}
                    </span>
                    {bookmark.acceptanceRate && (
                        <>
                            {" - "}
                            <span style={{ color: dark ? "#38bdf8" : "#2563eb" }}>
                                {bookmark.acceptanceRate} Acceptance
                            </span>
                        </>
                    )}
                </div>

                {bookmark.topics && bookmark.topics.length > 0 && (
                    <div style={{
                        padding: "0 8px 8px 8px",
                        fontSize: "13px",
                        color: dark ? "#a5b4fc" : "#334155"
                    }}>
                        <strong>Topics:</strong>{" "}
                        <button
                            style={{
                                marginLeft: "8px",
                                padding: "2px 10px",
                                borderRadius: "6px",
                                border: "none",
                                background: dark ? "#3730a3" : "#e0e7ff",
                                color: dark ? "#fff" : "#3730a3",
                                cursor: "pointer",
                                fontSize: "12px"
                            }}
                            onClick={() => setShowTopics(v => !v)}
                        >
                            {showTopics ? "Hide" : "Show"}
                        </button>
                        {showTopics && (
                            <ul style={{
                                margin: "8px 0 0 0",
                                padding: "0 0 0 18px",
                                listStyle: "disc",
                                background: dark ? "#232946" : "#f1f5f9",
                                borderRadius: "6px"
                            }}>
                                {bookmark.topics.map((topic, idx) => (
                                    <li
                                        key={idx}
                                        style={{ cursor: "pointer", textDecoration: "underline" }}
                                        onClick={() => openTopicPage(topic)}
                                    >
                                        {topic}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                <div style={{ display: "flex", gap: "10px", marginBottom: "4px", padding: "8px" }}>
                    <img src={play} alt="Open" title="Open Problem" style={iconStyle} onClick={openInNewTab} />
                    <img src={del} alt="Delete" title="Delete Bookmark" style={iconStyle} onClick={onDelete} />
                    <img
                        src={note}
                        alt="Notes"
                        title="Add/View Notes"
                        style={iconStyle}
                        onClick={() => {
                            chrome.tabs && chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                                const tab = tabs[0];
                                if (tab && tab.url && tab.url.includes("leetcode.com")) {
                                    chrome.tabs.sendMessage(tab.id, { type: "OPEN_LEETCODE_NOTE_MODAL", problemId: bookmark.id });
                                } else {
                                    showToast("Please open this on a LeetCode problem page.");
                                }
                            });
                        }}
                    />
                    <img src={copy} alt="Copy" title="Copy Link" style={iconStyle} onClick={onCopy} />
                </div>
            </div>
        </div>
    );
}

const iconStyle = {
    width: "20px",
    height: "20px",
    cursor: "pointer",
    borderRadius: "10px"
};
