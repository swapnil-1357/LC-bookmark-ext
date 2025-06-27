import React, { useEffect, useState } from "react";
import "../assets/InjectPopup.css";

const InjectPopup = ({ url, onSave }) => {
    const [difficulty, setDifficulty] = useState("Medium");
    const [importance, setImportance] = useState("Medium");
    const [problemName, setProblemName] = useState("Unknown Problem");

    useEffect(() => {
        // Try to get problem name from LeetCode class
        const titleEl = document.querySelector(".items-start h1") || document.querySelector("h1");
        if (titleEl) setProblemName(titleEl.textContent.trim());
        else console.warn("Problem name not found using '.items-start h1'");
    }, []);

    const handleSave = () => {
        const id = (url?.split("/") || []).filter(Boolean).pop() || "unknown-id";
        const bookmark = { id, name: problemName, url, difficulty, importance };
        onSave(bookmark);
    };

    return (
        <div className="inject-popup-container">
            <h4>Bookmark This Problem</h4>

            <label>
                Difficulty:
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                </select>
            </label>

            <label>
                Importance:
                <select value={importance} onChange={(e) => setImportance(e.target.value)}>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                </select>
            </label>

            <button onClick={handleSave}>Save</button>
        </div>
    );
};

export default InjectPopup;
