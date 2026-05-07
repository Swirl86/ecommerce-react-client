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

    if (user) {
        return (
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
        );
    }

    return (
        <Link to="/login" onClick={onClick} className={baseClasses}>
            <span className="material-symbols-outlined text-base">lock_open_right</span>
            Login
        </Link>
    );
}
