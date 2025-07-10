import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Editor } from "react-draft-wysiwyg";
import {
    EditorState,
    convertToRaw,
    convertFromRaw,
} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToMarkdown from "draftjs-to-markdown"; // ✅ fixed import

export default function NotesModal({ problemId, onClose }) {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const [overlayHover, setOverlayHover] = useState(false);
    const [saveButtonHover, setSaveButtonHover] = useState(false);
    const [cancelButtonHover, setCancelButtonHover] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        const loadNote = async () => {
            try {
                const result = await chrome.storage.local.get(`leetcode-note-${problemId}`);
                const rawContent = result[`leetcode-note-${problemId}`];
                if (rawContent) {
                    const contentState = convertFromRaw(JSON.parse(rawContent));
                    setEditorState(EditorState.createWithContent(contentState));
                }
            } catch (e) {
                console.error("Failed to load saved notes:", e);
            }
        };
        loadNote();
    }, [problemId]);

    useEffect(() => {
        const interval = setInterval(() => {
            const contentState = editorState.getCurrentContent();
            const rawContent = convertToRaw(contentState);
            chrome.storage.local.set({
                [`leetcode-note-${problemId}`]: JSON.stringify(rawContent),
            });
        }, 5000);
        return () => clearInterval(interval);
    }, [editorState, problemId]);

    const saveNote = async () => {
        const contentState = editorState.getCurrentContent();
        const rawContent = convertToRaw(contentState);
        try {
            await chrome.storage.local.set({
                [`leetcode-note-${problemId}`]: JSON.stringify(rawContent),
            });
            console.log("Notes saved successfully!");
        } catch (e) {
            console.error("Failed to save notes:", e);
            alert("Save failed. Content might be too large.");
        }
        onClose();
    };

    const exportMarkdown = () => {
        const markdown = draftToMarkdown(convertToRaw(editorState.getCurrentContent()));
        const blob = new Blob([markdown], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `leetcode-problem-${problemId}-notes.md`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return ReactDOM.createPortal(
        <>
            <style>{`
  .rdw-editor-main pre {
    background-color: #111 !important;
    color: #fff !important;
    padding: 8px 12px !important;
    border-radius: 6px;
    font-family: monospace;
    overflow-x: auto;
    margin: 8px 0;
  }

  .resizable-editor {
    resize: vertical;
    overflow: auto;
    min-height: 280px;
    max-height: 600px;
  }

  /* Toolbar icon colors */
  .rdw-option-wrapper {
    filter: invert(${isDarkMode ? 1 : 0});
  }
`}</style>

            <div
                style={{
                    ...modalStyle.overlay,
                    backgroundColor: overlayHover ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.6)",
                }}
                onClick={handleOverlayClick}
                onMouseEnter={() => setOverlayHover(true)}
                onMouseLeave={() => setOverlayHover(false)}
            >
                <div
                    style={{
                        ...modalStyle.modal,
                        backgroundColor: isDarkMode ? "#111" : "#fff",
                        color: isDarkMode ? "#fff" : "#000",
                    }}
                >
                    <div style={modalStyle.header}>
                        <h2
                            style={{
                                ...modalStyle.title,
                                color: isDarkMode ? "#fff" : "#222", // fixed title visibility
                            }}
                        >
                            📝 Notes for Problem #{problemId}
                        </h2>
                        <button
                            onClick={onClose}
                            style={modalStyle.closeButton}
                            title="Close (Esc)"
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#ff1744";
                                e.target.style.transform = "scale(1.1)";
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#f44336";
                                e.target.style.transform = "scale(1)";
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    <div style={modalStyle.editorWrapper} className="resizable-editor">
                        <Editor
                            editorState={editorState}
                            onEditorStateChange={setEditorState}
                            wrapperStyle={{
                                borderRadius: "8px",
                                overflow: "hidden",
                                border: "1px solid #444",
                            }}
                            editorStyle={{
                                ...modalStyle.editor,
                                backgroundColor: isDarkMode ? "#111" : "#fff",
                                color: isDarkMode ? "#fff" : "#000",
                            }}
                            toolbarStyle={{
                                ...modalStyle.toolbar,
                                backgroundColor: isDarkMode ? "#222" : "#f5f5f5",
                            }}
                            toolbar={{
                                options: ["inline", "blockType", "list", "link", "emoji"],
                                inline: {
                                    options: ["bold", "italic", "underline", "strikethrough"],
                                },
                                blockType: {
                                    inDropdown: true,
                                    options: ["Normal", "H1", "H2", "Blockquote", "Code"],
                                },
                                list: {
                                    inDropdown: true,
                                    options: ["unordered", "ordered"],
                                },
                                link: {
                                    options: ["link", "unlink"],
                                },
                                emoji: {},
                            }}
                        />
                    </div>

                    <div style={modalStyle.buttonContainer}>
                        <button
                            onClick={saveNote}
                            style={{
                                ...modalStyle.saveButton,
                                backgroundColor: saveButtonHover ? "#45a049" : "#4CAF50",
                                transform: saveButtonHover ? "translateY(-2px)" : "none",
                            }}
                            onMouseEnter={() => setSaveButtonHover(true)}
                            onMouseLeave={() => setSaveButtonHover(false)}
                        >
                            💾 Save
                        </button>
                        <button
                            onClick={exportMarkdown}
                            style={{
                                ...modalStyle.saveButton,
                                backgroundColor: "#1976d2",
                            }}
                        >
                            ⬇️ Export MD
                        </button>
                        <button
                            onClick={() => setIsDarkMode(!isDarkMode)}
                            style={{
                                ...modalStyle.cancelButton,
                                backgroundColor: "#888",
                            }}
                        >
                            {isDarkMode ? "🌞 Light" : "🌙 Dark"}
                        </button>
                        <button
                            onClick={onClose}
                            style={{
                                ...modalStyle.cancelButton,
                                backgroundColor: cancelButtonHover ? "#d32f2f" : "#f44336",
                                transform: cancelButtonHover ? "translateY(-2px)" : "none",
                            }}
                            onMouseEnter={() => setCancelButtonHover(true)}
                            onMouseLeave={() => setCancelButtonHover(false)}
                        >
                            ❌ Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
}

const modalStyle = {
    overlay: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
    },
    modal: {
        padding: "32px",
        borderRadius: "20px",
        width: "min(700px, 90vw)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        position: "relative",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    },
    title: {
        margin: 0,
        fontSize: "1.4em",
        fontWeight: "600",
    },
    closeButton: {
        background: "#f44336",
        color: "white",
        border: "none",
        borderRadius: "50%",
        width: "32px",
        height: "32px",
        cursor: "pointer",
        fontSize: "16px",
    },
    editorWrapper: {
        border: "2px solid #ddd",
        borderRadius: "12px",
        minHeight: "280px",
        maxHeight: "350px",
        overflow: "auto",
    },
    editor: {
        minHeight: "220px",
        padding: "16px",
    },
    toolbar: {
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
        padding: "8px",
        justifyContent: "flex-start",
        alignItems: "center",
        border: "1px solid #ddd",
        borderRadius: "8px 8px 0 0",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "20px",
        flexWrap: "wrap",
    },
    saveButton: {
        padding: "12px 20px",
        borderRadius: "12px",
        fontWeight: "600",
        color: "#fff",
        border: "none",
        cursor: "pointer",
    },
    cancelButton: {
        padding: "12px 20px",
        borderRadius: "12px",
        fontWeight: "600",
        color: "#fff",
        border: "none",
        cursor: "pointer",
    },
};
