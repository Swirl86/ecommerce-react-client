import { useEffect, useState } from "react";

export default function BackendStatusBadge({ showOffline, showRestored }) {
    const [visible, setVisible] = useState(false);
    const [text, setText] = useState("");
    const [color, setColor] = useState("");

    useEffect(() => {
        // --- SHOW OFFLINE BADGE ---
        if (showOffline) {
            setText("Backend offline ⚠️");
            setColor("bg-rose-600/90");

            requestAnimationFrame(() => setVisible(true));
            return;
        }

        // --- SHOW RESTORED BADGE ---
        if (showRestored) {
            setText("Connection restored ✓");
            setColor("bg-green-600");

            requestAnimationFrame(() => setVisible(true));
            return;
        }

        // --- HIDE BADGE (But keep mounted) ---
        setVisible(false);
    }, [showOffline, showRestored]);

    return (
        <div
            className={`
                absolute left-1/2 top-full mt-2
                -translate-x-1/2
                text-xs px-3 py-1 rounded-md shadow-md
                text-white whitespace-nowrap pointer-events-none
                transition-all duration-500 ease-out
                ${color}
                ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}
                ${showOffline ? "animate-pulse" : ""}
            `}
        >
            {text}
        </div>
    );
}
