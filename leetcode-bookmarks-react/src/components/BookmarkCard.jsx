import React from "react";
import play from "../assets/play.png";
import del from "../assets/delete.png";
import note from "../assets/note.png";
import copy from "../assets/copy.png";

export default function BookmarkCard({ bookmark, onDelete, onNote, onCopy }) {
    const openInNewTab = () => {
        if (chrome?.tabs?.create) {
            chrome.tabs.create({ url: bookmark.url });
        } else {
            window.open(bookmark.url, "_blank");
        }
    };

    const importanceColors = {
        High: "#e74c3c",     // red
        Medium: "#f39c12",   // orange
        Low: "#2ecc71"       // green
    };

    const difficultyColors = {
        Easy: "#2ecc71",
        Medium: "#f39c12",
        Hard: "#e74c3c"
    };

    return (
        <div className="bookmark-card-animated">
            <div style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "10px",
                marginBottom: "10px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
            }}>
                <div style={{
                    fontWeight: "600",
                    fontSize: "16px",
                    marginBottom: "4px"
                }}>{bookmark.name}</div>

                <div style={{ marginBottom: "8px", fontSize: "14px" }}>
                    <span style={{ color: importanceColors[bookmark.importance] }}>
                        {bookmark.importance}
                    </span>
                    {" - "}
                    <span style={{ color: difficultyColors[bookmark.difficulty] }}>
                        {bookmark.difficulty}
                    </span>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    <img src={play} alt="Open" title="Open Problem" style={iconStyle} onClick={openInNewTab} />
                    <img src={del} alt="Delete" title="Delete Bookmark" style={iconStyle} onClick={onDelete} />
                    <img src={note} alt="Notes" title="Add/View Notes" style={iconStyle} onClick={onNote} />
                    <img src={copy} alt="Copy" title="Copy Link" style={iconStyle} onClick={onCopy} />
                </div>
            </div>
        </div>
    );
}

const iconStyle = {
    width: "20px",
    height: "20px",
    cursor: "pointer"
};
