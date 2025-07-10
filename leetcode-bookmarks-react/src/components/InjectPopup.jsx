import React, { useState, useEffect } from "react";

const styles = {
    container: {
        background: "linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)",
        border: "2px solid #6366f1",
        padding: "28px 32px 24px 32px",
        borderRadius: "18px",
        boxShadow: "0 8px 32px rgba(60, 72, 180, 0.18)",
        minWidth: "320px",
        maxWidth: "380px",
        fontFamily: "'Segoe UI', Arial, sans-serif",
        color: "#222",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        gap: "8px",
        animation: "popup-fade-in 0.4s"
    },
    title: {
        margin: "0 0 12px 0",
        fontSize: "1.35em",
        textAlign: "center",
        background: "linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)",
        color: "#fff",
        borderRadius: "10px",
        padding: "10px 0",
        letterSpacing: "0.5px",
        boxShadow: "0 2px 8px rgba(99,102,241,0.08)"
    },
    row: {
        display: "flex",
        alignItems: "center",
        marginBottom: "12px",
        fontSize: "1em",
        flexWrap: "wrap"
    },
    bullet: {
        color: "#06b6d4",
        fontWeight: "bold",
        fontSize: "1.3em",
        marginRight: "10px",
        lineHeight: 1,
        display: "inline-block",
        width: "18px",
        textAlign: "center"
    },
    label: {
        fontWeight: 600,
        color: "#6366f1",
        marginRight: "8px"
    },
    select: {
        marginLeft: "8px",
        padding: "6px 14px",
        borderRadius: "7px",
        border: "1.5px solid #a5b4fc",
        background: "#f1f5f9",
        color: "#3730a3",
        fontWeight: 500,
        fontSize: "1em"
    },
    button: {
        marginTop: "14px",
        padding: "12px 0",
        background: "linear-gradient(90deg, #06b6d4 0%, #6366f1 100%)",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        fontSize: "1.08em",
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(6,182,212,0.12)",
        letterSpacing: "0.5px",
        transition: "transform 0.15s ease"
    },    
    buttonHover: {
        transform: "scale(1.02)"
    },
    topic: {
        color: "#06b6d4",
        textDecoration: "underline",
        cursor: "pointer",
        marginRight: "8px"
    }
};

const InjectPopup = ({ url, problemName, onSave, acceptanceRate, topics }) => {
    const [difficulty, setDifficulty] = useState("Medium");
    const [importance, setImportance] = useState("Medium");

    const handleSave = () => {
        const id = (url?.split("/") || []).filter(Boolean).pop() || "unknown-id";
        const bookmark = {
            id,
            name: problemName,
            url,
            difficulty,
            importance,
            acceptanceRate,
            topics
        };
        onSave(bookmark);
    };

    const openTagPage = (topicName) => {
        const slug = topicName.toLowerCase().replace(/\s+/g, "-");
        const tagUrl = `https://leetcode.com/tag/${slug}/`;
        window.open(tagUrl, "_blank");
    };

    return (
        <div id="leetcode-injected-popup" style={styles.container}>
            <h3 style={styles.title}>Bookmark This Problem</h3>

            <div style={styles.row}>
                <span style={styles.bullet}>•</span>
                <strong>Name:</strong>&nbsp;{problemName}
            </div>

            {acceptanceRate && (
                <div style={styles.row}>
                    <span style={styles.bullet}>•</span>
                    <span>
                        <strong>Acceptance Rate:</strong>&nbsp;{acceptanceRate}
                    </span>
                </div>
            )}

            {topics && topics.length > 0 && (
                <div style={styles.row}>
                    <span style={styles.bullet}>•</span>
                    <span>
                        <strong>Topics:</strong>&nbsp;
                        {topics.map((topic, idx) => (
                            <span
                                key={idx}
                                style={styles.topic}
                                onClick={() => openTagPage(topic)}
                            >
                                {topic}
                            </span>
                        ))}
                    </span>
                </div>
            )}

            <div style={styles.row}>
                <span style={styles.bullet}>•</span>
                <label style={styles.label}>
                    Difficulty:
                    <select
                        style={styles.select}
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                    >
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </select>
                </label>
            </div>

            <div style={styles.row}>
                <span style={styles.bullet}>•</span>
                <label style={styles.label}>
                    Importance:
                    <select
                        style={styles.select}
                        value={importance}
                        onChange={(e) => setImportance(e.target.value)}
                    >
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>
                </label>
            </div>

            <button
                style={styles.button}
                onClick={handleSave}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
                Save
            </button>
        </div>
    );
};

export default InjectPopup;
