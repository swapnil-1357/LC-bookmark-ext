const LC_PROBLEM_KEY = "LC_PROBLEM_KEY";
const bookmarksList = document.getElementById("bookmarksList");
const difficultyFilter = document.getElementById("difficultyFilter");

document.addEventListener("DOMContentLoaded", async () => {
    const bookmarks = await getBookmarks();
    renderBookmarks(bookmarks);
});

difficultyFilter.addEventListener("change", async () => {
    const bookmarks = await getBookmarks();
    renderBookmarks(bookmarks);
});

function getBookmarks() {
    return new Promise((resolve) => {
        chrome.storage.sync.get([LC_PROBLEM_KEY], (result) => {
            resolve(result[LC_PROBLEM_KEY] || []);
        });
    });
}

function renderBookmarks(bookmarks) {
    const selectedDiff = difficultyFilter.value;
    const sections = { Easy: [], Medium: [], Hard: [] };

    // Filter and categorize
    bookmarks
        .filter(b => selectedDiff === "All" || b.difficulty === selectedDiff)
        .sort((a, b) => {
            const priority = { High: 1, Medium: 2, Low: 3 };
            return priority[a.importance] - priority[b.importance];
        })
        .forEach(b => sections[b.difficulty]?.push(b));

    bookmarksList.innerHTML = "";

    Object.entries(sections).forEach(([difficulty, items]) => {
        if (items.length === 0) return;

        const sectionTitle = document.createElement("div");
        sectionTitle.textContent = difficulty;
        sectionTitle.className = "section-title";
        bookmarksList.appendChild(sectionTitle);

        items.forEach(bookmark => {
            const div = document.createElement("div");
            div.className = "bookmark";

            const title = document.createElement("div");
            title.className = "bookmark-title";
            title.textContent = bookmark.name;

            const meta = document.createElement("div");
            meta.className = "bookmark-meta";
            meta.innerHTML = `<span class="importance-${bookmark.importance.toLowerCase()}">${bookmark.importance}</span> - ${bookmark.difficulty}`;

            const controls = document.createElement("div");
            controls.className = "bookmark-controls";

            const openBtn = document.createElement("img");
            openBtn.src = "assets/play.png";
            openBtn.title = "Open";
            openBtn.onclick = () => chrome.tabs.create({ url: bookmark.url });

            const deleteBtn = document.createElement("img");
            deleteBtn.src = "assets/delete.png";
            deleteBtn.title = "Delete";
            deleteBtn.onclick = async () => {
                const updated = (await getBookmarks()).filter(b => b.id !== bookmark.id);
                chrome.storage.sync.set({ [LC_PROBLEM_KEY]: updated }, () => renderBookmarks(updated));
            };

            controls.appendChild(openBtn);
            controls.appendChild(deleteBtn);

            div.appendChild(title);
            div.appendChild(meta);
            div.appendChild(controls);

            bookmarksList.appendChild(div);
        });
    });
}
