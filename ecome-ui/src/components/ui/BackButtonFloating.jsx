import { useNavigate } from "react-router-dom";

export default function BackButtonFloating() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="
        p-2 rounded-full
        bg-white/90 dark:bg-gray-800/90
        shadow-lg
        border border-gray-200 dark:border-gray-700
        hover:bg-white dark:hover:bg-gray-700
        transition
    "
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-700 dark:text-gray-200"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                />
            </svg>
        </button>
    );
}
