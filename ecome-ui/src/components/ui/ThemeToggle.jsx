import { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "light" || saved === "dark") return saved;

        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        return prefersDark ? "dark" : "light";
    });

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    function toggleTheme() {
        setTheme(theme === "light" ? "dark" : "light");
    }

    return (
        <button
            onClick={toggleTheme}
            className={[
                "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 shadow-sm hover:shadow-md focus:outline-none focus:ring-2",
                theme === "light"
                    ? "bg-sky-200 text-sky-800 hover:bg-sky-300 focus:ring-sky-400"
                    : "bg-gray-700 text-sky-200 hover:bg-gray-600 focus:ring-sky-500",
            ].join(" ")}
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
            <span className="text-xl">{theme === "light" ? "🌞" : "🌙"}</span>
        </button>
    );
}
