// popupNotes.js

export function showNotesPopup(problemId, savedNote) {
    const overlay = document.createElement("div");
    Object.assign(overlay.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    });

    const popup = document.createElement("div");
    Object.assign(popup.style, {
        width: "90vw",
        height: "90vh",
        backgroundColor: "#1e1e1e",
        color: "#ffffff",
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 0 40px rgba(0,0,0,0.7)",
        overflow: "hidden",
    });

    const title = document.createElement("h2");
    title.innerText = "Save Notes";
    Object.assign(title.style, {
        fontSize: "1.8rem",
        marginBottom: "12px",
    });

    const content = document.createElement("div");
    content.contentEditable = true;
    content.innerHTML = savedNote || `<p>Write notes here. You can paste <strong>links</strong>, <em>markdown</em>, or base64 <code>screenshots</code>.</p>`;
    Object.assign(content.style, {
        flex: "1",
        padding: "16px",
        backgroundColor: "#2c2c2c",
        borderRadius: "8px",
        border: "1px solid #444",
        fontSize: "1rem",
        overflowY: "auto",
        outline: "none",
        lineHeight: "1.6",
        whiteSpace: "pre-wrap",
    });

    const buttonContainer = document.createElement("div");
    Object.assign(buttonContainer.style, {
        display: "flex",
        justifyContent: "flex-end",
        gap: "16px",
        marginTop: "16px"
    });

    const saveBtn = document.createElement("button");
    saveBtn.innerText = "Save";
    Object.assign(saveBtn.style, {
        padding: "10px 20px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "1rem",
        cursor: "pointer",
    });
    saveBtn.onclick = () => {
        localStorage.setItem(`leetcode-notes-${problemId}`, content.innerHTML);
        document.body.removeChild(overlay);
    };

    const closeBtn = document.createElement("button");
    closeBtn.innerText = "Close";
    Object.assign(closeBtn.style, {
        padding: "10px 20px",
        backgroundColor: "#f44336",
        color: "white",
        border: "none",
        borderRadius: "6px",
        fontSize: "1rem",
        cursor: "pointer",
    });
    closeBtn.onclick = () => {
        document.body.removeChild(overlay);
    };

    buttonContainer.appendChild(closeBtn);
    buttonContainer.appendChild(saveBtn);

    // Add CSS for zoomable images and clickable links
    const style = document.createElement("style");
    style.textContent = `
        [contenteditable] a {
            color: #00afff;
            text-decoration: underline;
        }
        [contenteditable] img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 10px auto;
            cursor: zoom-in;
            transition: transform 0.3s ease;
        }
        [contenteditable] img.zoomed {
            transform: scale(2.5);
            z-index: 10000;
            cursor: zoom-out;
        }
    `;
    document.head.appendChild(style);

    content.addEventListener("click", (e) => {
        if (e.target.tagName === "IMG") {
            e.target.classList.toggle("zoomed");
        }
    });

    popup.appendChild(title);
    popup.appendChild(content);
    popup.appendChild(buttonContainer);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}
