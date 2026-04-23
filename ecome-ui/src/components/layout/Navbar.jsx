import { Link } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";

export default function Navbar() {
    return (
        <header className="border-b bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-xl font-semibold tracking-wide">
                    E‑ComE
                </Link>

                {/* Navigation */}
                <nav className="hidden md:flex gap-6 text-sm font-medium">
                    <Link
                        to="/products"
                        className="text-gray-900 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                        Shop
                    </Link>

                    <Link
                        to="/new"
                        className="text-gray-900 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                        New Arrivals
                    </Link>

                    <Link
                        to="/bestsellers"
                        className="text-gray-900 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                        Best Sellers
                    </Link>

                    <Link
                        to="/collections"
                        className="text-gray-900 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                        Collections
                    </Link>

                    <Link
                        to="/deals"
                        className="text-gray-900 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                        Deals
                    </Link>

                    <Link
                        to="/about"
                        className="text-gray-900 dark:text-gray-100 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                        About
                    </Link>
                </nav>

                {/* Icons */}
                <div className="flex items-center gap-4">
                    <span>🔍</span>
                    <a href="/cart">🛒</a>
                    <Link
                        to="/login"
                        className="text-sm hover:text-gray-500 dark:hover:text-gray-300"
                    >
                        Login
                    </Link>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
