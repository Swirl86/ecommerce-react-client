import { Link } from "react-router-dom";
import { useBackendStatus } from "../../hooks/useBackendStatus";
import ThemeToggle from "../ui/ThemeToggle";

export default function Navbar() {
    const backendOnline = useBackendStatus();

    return (
        <header className="backdrop-blur bg-neutral-50/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/" className="flex items-center">
                    {/* Light mode logo */}
                    <img
                        src="/images/logo-dark.png"
                        alt="E‑ComE logo"
                        className="h-14 w-auto dark:hidden"
                    />

                    {/* Dark mode logo */}
                    <img
                        src="/images/logo-light.png"
                        alt="E‑ComE logo"
                        className="h-14 w-auto hidden dark:block"
                    />
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex gap-6 text-sm font-medium">
                    {[
                        ["Shop", "/products"],
                        ["New Arrivals", "/new"],
                        ["Best Sellers", "/bestsellers"],
                        ["Collections", "/collections"],
                        ["Deals", "/deals"],
                        ["About", "/about"],
                    ].map(([label, path]) => (
                        <Link
                            key={path}
                            to={path}
                            className="text-gray-700 dark:text-gray-300 hover:text-sky-500 dark:hover:text-sky-300 transition-colors"
                        >
                            {label}
                        </Link>
                    ))}
                </nav>

                {/* Icons + Backend status */}
                <div className="flex items-center gap-4 text-lg">
                    {/* Backend offline badge */}
                    {!backendOnline && (
                        <span className="text-xs bg-rose-600 text-white px-2 py-1 rounded shadow">
                            Backend offline
                        </span>
                    )}

                    <span className="hover:text-sky-500 dark:hover:text-sky-300 transition">
                        🔍
                    </span>

                    <Link
                        to="/cart"
                        className="hover:text-sky-500 dark:hover:text-sky-300 transition"
                    >
                        🛒
                    </Link>

                    <Link
                        to="/login"
                        className="text-sm hover:text-sky-500 dark:hover:text-sky-300 transition"
                    >
                        Login
                    </Link>

                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
