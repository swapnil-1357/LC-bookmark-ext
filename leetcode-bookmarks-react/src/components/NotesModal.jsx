// components/NotesModal.jsx
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

export default function NotesModal({ problemId, onClose }) {
    const [note, setNote] = useState("");

    useEffect(() => {
        const stored = localStorage.getItem(`leetcode-notes-${problemId}`) || "";
        setNote(stored);
    }, [problemId]);

    const saveNote = () => {
        localStorage.setItem(`leetcode-notes-${problemId}`, note);
        onClose();
    };

    return ReactDOM.createPortal(
        <div style={modalStyle.overlay}>
            <div style={modalStyle.modal}>
                <h2>📝 Notes</h2>
                <textarea
                    rows="8"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    style={{ width: "100%", marginBottom: "10px" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <button onClick={saveNote}>💾 Save</button>
                    <button onClick={onClose} style={{ background: "#888" }}>❌ Cancel</button>
                </div>
            </div>
        </div>,
        document.body
    );
}

const modalStyle = {
    overlay: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999
    },
    modal: {
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        width: "280px",
        maxWidth: "90%",
        boxShadow: "0 10px 20px rgba(0,0,0,0.2)"
    }
};
