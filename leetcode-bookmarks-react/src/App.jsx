// App.jsx
import React, { useEffect, useState } from 'react';
import BookmarkCard from './components/BookmarkCard';
import NotesModal from './components/NotesModal';
import { useHybridSearch } from './hooks/useHybridSearch';
import { useDebounce } from './hooks/useDebounce';

const LC_KEY = "LC_PROBLEM_KEY";

export default function App() {
  const [bookmarks, setBookmarks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [noteId, setNoteId] = useState(null);
  const [dark, setDark] = useState(true);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState([]);

  const debouncedSearch = useDebounce(search, 300);

  // Ensure accessor is safe
  const safeBookmarks = bookmarks.filter(b => typeof b.name === "string" && b.name.trim().length > 0);
  const { search: hybridSearch, isReady } = useHybridSearch(safeBookmarks, b => b?.name ?? "");

  const loadBookmarks = () => {
    chrome.storage.sync.get([LC_KEY], (result) => {
      const data = result[LC_KEY] || [];
      setBookmarks(data);
      setFiltered(data);
    });
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  useEffect(() => {
    const listener = (changes, area) => {
      if (area === "sync" && changes[LC_KEY]) {
        const updated = changes[LC_KEY].newValue || [];
        setBookmarks(updated);
        setFiltered(updated);
      }
    };
    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, []);

  useEffect(() => {
    if (!debouncedSearch.trim()) {
      setFiltered(
        bookmarks.filter(b =>
          filter === "All" || b.difficulty === filter
        ).sort((a, b) => {
          const priority = { High: 1, Medium: 2, Low: 3 };
          return priority[a.importance] - priority[b.importance];
        })
      );
    } else if (isReady) {
      hybridSearch(debouncedSearch).then(results => {
        const filteredByDiff = results.filter(b =>
          filter === "All" || b.difficulty === filter
        );
        setFiltered(
          filteredByDiff.sort((a, b) => {
            const priority = { High: 1, Medium: 2, Low: 3 };
            return priority[a.importance] - priority[b.importance];
          })
        );
      });
    }
  }, [debouncedSearch, filter, bookmarks, isReady]);

  const handleDelete = (id) => {
    const updated = bookmarks.filter(b => b.id !== id);
    chrome.storage.sync.set({ [LC_KEY]: updated }, () => {
      setBookmarks(updated);
      setFiltered(updated);
    });
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url).then(() => alert("Link copied!"));
  };

  return (
    <div className={`popup-container${dark ? " dark" : ""}`}>
      <div className="container">
        <button
          className="theme-toggle-btn"
          onClick={() => setDark(d => !d)}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            background: dark
              ? "linear-gradient(90deg,#6366f1,#06b6d4)"
              : "linear-gradient(90deg,#f1f5f9,#e0e7ff)",
            color: dark ? "#fff" : "#222",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
            fontSize: "18px",
            boxShadow: "0 2px 8px rgba(99,102,241,0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px auto",
            transition: "background 0.2s"
          }}
          aria-label="Toggle dark mode"
        >
          {dark ? "🌙" : "☀️"}
        </button>

        <h1 className="popup-title">📚 Bookmarked Problems</h1>

        <input
          type="text"
          placeholder="Search by question name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "95%",
            padding: "8px 8px",
            marginBottom: "12px",
            borderRadius: "8px",
            border: "1.5px solid #a5b4fc",
            fontSize: "1em",
            outline: "none",
            background: dark ? "#232946" : "#fff",
            color: dark ? "#fff" : "#222"
          }}
        />

        <select
          className="popup-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
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
              key={b.id + b.difficulty + b.importance}
              bookmark={b}
              onDelete={() => handleDelete(b.id)}
              onNote={() => setNoteId(b.id)}
              onCopy={() => handleCopy(b.url)}
              dark={dark}
            />
          ))
        )}

        {noteId && (
          <NotesModal
            problemId={noteId}
            onClose={() => setNoteId(null)}
            dark={dark}
          />
        )}
      </div>
    </div>
  );
}
