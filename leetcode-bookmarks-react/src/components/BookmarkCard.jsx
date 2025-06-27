// components/BookmarkCard.jsx
import React from "react";
import play from "../assets/play.png";
import del from "../assets/delete.png";
import note from "../assets/note.png";
import copy from "../assets/copy.png";

export default function BookmarkCard({ bookmark, onDelete, onNote, onCopy }) {
    return (
        <div className="bookmark">
            <div className="bookmark-title">{bookmark.name}</div>
            <div className="bookmark-meta">
                <span className={`importance-${bookmark.importance.toLowerCase()}`}>
                    {bookmark.importance}
                </span>{" "}
                - {bookmark.difficulty}
            </div>
            <div className="bookmark-controls">
                <img src={play} title="Open" onClick={() => chrome.tabs.create({ url: bookmark.url })} />
                <img src={del} title="Delete" onClick={onDelete} />
                <img src={note} title="Notes" onClick={onNote} />
                <img src={copy} title="Copy Link" onClick={onCopy} />
            </div>
        </div>
    );
}
