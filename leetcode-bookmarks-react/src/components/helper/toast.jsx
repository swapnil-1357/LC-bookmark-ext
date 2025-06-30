export const showToast = (message) => {
    if (!message) return;
    const oldToast = document.getElementById("lc-toast");
    if (oldToast) oldToast.remove();

    const toast = document.createElement("div");
    toast.id = "lc-toast";
    toast.textContent = message;
    Object.assign(toast.style, {
        position: "fixed",
        top: "32px",
        right: "32px",
        left: "auto",
        bottom: "auto",
        transform: "none",
        background: "linear-gradient(90deg,#06b6d4,#6366f1)",
        color: "#fff",
        padding: "14px 32px",
        borderRadius: "24px",
        fontSize: "1.08em",
        fontWeight: 600,
        boxShadow: "0 4px 24px rgba(99,102,241,0.18)",
        zIndex: 99999,
        opacity: 0,
        transition: "opacity 0.3s"
    });
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = 1; }, 10);
    setTimeout(() => {
        toast.style.opacity = 0;
        setTimeout(() => toast.remove(), 400);
    }, 1800);
}
