import { useCart } from "@hooks/cart/useCart";
import LogoSwitcher from "@ui/LogoSwitcher";
import ThemeToggle from "@ui/ThemeToggle";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AuthButton from "../auth/AuthButton";

export default function Navbar() {
    const navRef = useRef(null);
    const [menuOpen, setMenuOpen] = useState(false);

    const { cart, version } = useCart();
    const count = cart?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

    useEffect(() => {
        // trigger rendering
    }, [version]);

    return (
        <header className="backdrop-blur bg-neutral-50/80 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
            {/* TOP BAR */}
            <div className="max-w-7xl mx-auto px-4 py-4 relative flex items-center justify-between">
                {/* LEFT: Logo */}
                <LogoSwitcher />

                {/* CENTER: Desktop navigation */}
                <nav ref={navRef} className="hidden md:flex gap-6 text-sm font-medium">
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

                {/* RIGHT: Desktop icon bar */}
                <div className="hidden sm:flex items-center gap-4 text-lg">
                    <span className="hover:text-sky-500 dark:hover:text-sky-300 transition">
                        🔍
                    </span>

                    <Link
                        to="/cart"
                        className="
                            relative p-2 rounded-full transition-all duration-300
                            hover:bg-gray-200 dark:hover:bg-gray-700
                            hover:text-sky-600 dark:hover:text-sky-300
                            active:scale-95
                        "
                    >
                        🛒
                        {count > 0 && (
                            <span
                                className="
                                    absolute -top-1 -right-1
                                    bg-sky-500 text-white text-xs font-semibold
                                    w-5 h-5 flex items-center justify-center
                                    rounded-full shadow
                                    dark:bg-sky-400
                                "
                            >
                                {count}
                            </span>
                        )}
                    </Link>

                    <AuthButton />
                    <ThemeToggle />
                </div>

                {/* MOBILE: Hamburger button */}
                <button
                    className="md:hidden text-3xl transition-transform duration-300 active:scale-90"
                    onClick={() => setMenuOpen((o) => !o)}
                >
                    {menuOpen ? "✕" : "☰"}
                </button>
            </div>

            {/* MOBILE MENU PANEL */}
            <div
                className={`
                    md:hidden
                    overflow-hidden
                    transition-all duration-300 ease-out
                    ${menuOpen ? "max-h-96 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-2"}
                `}
            >
                <div className="px-4 pb-4 flex flex-col gap-4 text-lg bg-neutral-50/90 dark:bg-gray-800/90 border-t border-gray-200 dark:border-gray-700 backdrop-blur">
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
                            onClick={() => setMenuOpen(false)}
                        >
                            {label}
                        </Link>
                    ))}

                    <div className="flex items-center gap-4 text-xl pt-2">
                        <span className="hover:text-sky-500 dark:hover:text-sky-300 transition">
                            🔍
                        </span>

                        <Link
                            to="/cart"
                            className="relative hover:text-sky-500 dark:hover:text-sky-300 transition"
                        >
                            🛒
                            {count > 0 && (
                                <span
                                    className="
                                        absolute -top-1 -right-1
                                        bg-sky-500 text-white text-xs font-semibold
                                        w-5 h-5 flex items-center justify-center
                                        rounded-full shadow
                                        dark:bg-sky-400
                                    "
                                >
                                    {count}
                                </span>
                            )}
                        </Link>

                        <AuthButton onClick={() => setMenuOpen(false)} />
                        <ThemeToggle />
                    </div>
                </div>
            </div>
        </header>
    );
}
