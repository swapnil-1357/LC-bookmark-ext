// App.jsx
import React, { useEffect, useState } from 'react';
import BookmarkCard from './components/BookmarkCard';
import NotesModal from './components/NotesModal';

const LC_KEY = "LC_PROBLEM_KEY";

export default function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [noteId, setNoteId] = useState(null);

  const loadBookmarks = () => {
    chrome.storage.sync.get([LC_KEY], (result) => {
      setBookmarks(result[LC_KEY] || []);
    });
  };

  useEffect(() => {
    loadBookmarks(); // on popup open
  }, []);

  // Live update when bookmarks are changed in other tabs
  useEffect(() => {
    const listener = (changes, area) => {
      if (area === "sync" && changes[LC_KEY]) {
        setBookmarks(changes[LC_KEY].newValue || []);
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  const handleDelete = (id) => {
    const updated = bookmarks.filter(b => b.id !== id);
    chrome.storage.sync.set({ [LC_KEY]: updated }, () => setBookmarks(updated));
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url).then(() => alert("Link copied!"));
  };

  const filtered = bookmarks
    .filter(b => filter === "All" || b.difficulty === filter)
    .sort((a, b) => {
      const priority = { High: 1, Medium: 2, Low: 3 };
      return priority[a.importance] - priority[b.importance];
    });

  return (
    <div className="container">
      <h1>📚 Bookmarked Problems</h1>

      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="All">All</option>
        <option value="Easy">🟢 Easy</option>
        <option value="Medium">🟠 Medium</option>
        <option value="Hard">🔴 Hard</option>
      </select>

      {filtered.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          No bookmarks found for this filter.
        </p>
      ) : (
        filtered.map(b => (
          <BookmarkCard
            key={b.id}
            bookmark={b}
            onDelete={() => handleDelete(b.id)}
            onNote={() => setNoteId(b.id)}
            onCopy={() => handleCopy(b.url)}
          />
        ))
      )}

      {noteId && (
        <NotesModal
          problemId={noteId}
          onClose={() => setNoteId(null)}
        />
      )}
    </div>
  );
}
