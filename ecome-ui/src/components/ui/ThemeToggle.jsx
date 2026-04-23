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
                "w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300",
                "shadow-sm hover:shadow-md focus:outline-none focus:ring-2",
                theme === "light"
                    ? "bg-yellow-300 text-yellow-900 hover:bg-yellow-400 focus:ring-yellow-500"
                    : "bg-gray-700 text-gray-100 hover:bg-gray-600 focus:ring-gray-400",
            ].join(" ")}
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
            {theme === "light" ? (
                <span className="text-xl">🌞</span>
            ) : (
                <span className="text-xl">🌙</span>
            )}
        </button>
    );
}
