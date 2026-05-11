import { useAuth } from "@context/AuthContext";
import { useAuthActions } from "@hooks/auth/useAuthActions";
import { Link } from "react-router-dom";

export default function AuthButton({ onClick }) {
    const { user } = useAuth();
    const { logout } = useAuthActions();

    const baseClasses = `
        flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium
        border border-[var(--color-primary)]
        text-[var(--color-primary-dark)] dark:text-[var(--color-primary)]
        bg-transparent cursor-pointer
        transition-all duration-200
        hover:bg-[var(--color-primary)] hover:text-white dark:hover:text-gray-900
        active:scale-[0.97]
    `;

    /* TODO - show profile picture instead of generic icon when implemented */
    if (user) {
        return (
            <div className="flex items-center gap-2">
                {/* Profile avatar */}
                <Link
                    to="/profile"
                    onClick={onClick}
                    className="
                        w-9 h-9 rounded-full bg-[var(--color-primary)]
                        text-white flex items-center justify-center
                        text-lg hover:bg-[var(--color-primary-dark)]
                        transition active:scale-95
                    "
                    title="Your profile"
                >
                    👤
                </Link>

                {/* Logout button */}
                <button
                    type="button"
                    onClick={async () => {
                        await logout();
                        onClick?.();
                    }}
                    className={baseClasses}
                >
                    <span className="material-symbols-outlined text-base">lock</span>
                    Logout
                </button>
            </div>
        );
    }

    return (
        <Link to="/login" onClick={onClick} className={baseClasses}>
            <span className="material-symbols-outlined text-base">lock_open_right</span>
            Login
        </Link>
    );
}
