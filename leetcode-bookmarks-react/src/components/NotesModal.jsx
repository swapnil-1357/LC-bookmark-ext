import React, { useState, useEffect, useCallback } from "react";
import ReactDOM from "react-dom";
import { Editor } from "react-draft-wysiwyg";
import {
    EditorState,
    convertToRaw,
    convertFromRaw,
} from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import axios from "axios";

const VITE_CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const VITE_CLOUD_PRESET = import.meta.env.VITE_CLOUD_PRESET;

export default function NotesModal({ problemId, onClose }) {
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );
    const [overlayHover, setOverlayHover] = useState(false);
    const [saveButtonHover, setSaveButtonHover] = useState(false);
    const [cancelButtonHover, setCancelButtonHover] = useState(false);

    useEffect(() => {
        const loadNote = async () => {
            try {
                const result = await chrome.storage.local.get(
                    `leetcode-note-${problemId}`
                );
                const rawContent = result[`leetcode-note-${problemId}`];
                if (rawContent) {
                    const contentState = convertFromRaw(JSON.parse(rawContent));
                    setEditorState(EditorState.createWithContent(contentState));
                } else {
                    setEditorState(EditorState.createEmpty());
                }
            } catch (e) {
                console.error("Failed to load saved notes:", e);
            }
        };
        loadNote();
    }, [problemId]);

    const saveNote = async () => {
        const contentState = editorState.getCurrentContent();
        const rawContent = convertToRaw(contentState);
        try {
            await chrome.storage.local.set({
                [`leetcode-note-${problemId}`]: JSON.stringify(rawContent),
            });
            console.log("Notes saved successfully!");
        } catch (e) {
            console.error("Failed to save notes to Chrome Storage:", e);
            alert("Failed to save notes. The content might be too large.");
        }
        onClose();
    };

    const uploadImage = useCallback(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", VITE_CLOUD_PRESET);

        try {
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${VITE_CLOUD_NAME}/image/upload`,
                formData
            );
            return res.data.secure_url;
        } catch (error) {
            console.error("Cloudinary upload failed:", error.response?.data);
            throw new Error("Image upload failed");
        }
    }, []);

    const uploadImageCallBack = (file) => {
        return new Promise((resolve, reject) => {
            uploadImage(file)
                .then((url) => resolve({ data: { link: url } }))
                .catch(reject);
        });
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return ReactDOM.createPortal(
        <div
            style={{
                ...modalStyle.overlay,
                backgroundColor: overlayHover
                    ? "rgba(0,0,0,0.7)"
                    : "rgba(0,0,0,0.6)",
            }}
            onClick={handleOverlayClick}
            onMouseEnter={() => setOverlayHover(true)}
            onMouseLeave={() => setOverlayHover(false)}
        >
            <div style={modalStyle.modal}>
                <div style={modalStyle.header}>
                    <h2 style={modalStyle.title}>📝 Notes for Problem #{problemId}</h2>
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

                <div style={modalStyle.editorWrapper}>
                    <Editor
                        editorState={editorState}
                        onEditorStateChange={setEditorState}
                        wrapperStyle={{
                            borderRadius: "8px",
                            overflow: "hidden",
                            border: "1px solid #444",
                        }}
                        editorStyle={modalStyle.editor}
                        toolbarStyle={modalStyle.toolbar}
                        toolbar={{
                            options: ["inline", "blockType", "list", "link", "emoji", "image"],
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
                            image: {
                                uploadEnabled: true,
                                uploadCallback: uploadImageCallBack,
                                previewImage: true,
                                inputAccept: "image/*",
                                alignmentEnabled: true,
                                alt: { present: false, mandatory: false },
                                defaultSize: {
                                    height: "auto",
                                    width: "100%",
                                },
                            },
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
                        💾 Save Notes
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
        </div>,
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
        background: "#fff",
        padding: "32px",
        borderRadius: "20px",
        width: "min(700px, 90vw)",
        minHeight: "500px",
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
        color: "#333",
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
        backgroundColor: "#111",
        borderRadius: "12px",
        minHeight: "280px",
        maxHeight: "350px",
        overflow: "auto",
    },
    editor: {
        minHeight: "220px",
        padding: "16px",
        backgroundColor: "transparent",
        color: "#fff",
    },
    toolbar: {
        display: "flex",
        flexWrap: "wrap",
        gap: "6px",
        padding: "8px",
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        border: "1px solid #ddd",
        borderRadius: "8px 8px 0 0",
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "flex-end",
        gap: "12px",
        marginTop: "20px",
    },
    saveButton: {
        padding: "12px 24px",
        borderRadius: "12px",
        fontWeight: "600",
        color: "blue",
        border: "none",
        cursor: "pointer",
    },
    cancelButton: {
        padding: "12px 24px",
        borderRadius: "12px",
        fontWeight: "600",
        color: "red",
        border: "none",
        cursor: "pointer",
    },
};
