import { useNavigate } from "react-router-dom";

export default function BackButton({ text = "Back" }) {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate(-1)}
            className="
                inline-flex items-center gap-2
                px-4 py-2 rounded-lg
                bg-gray-100 dark:bg-gray-700
                hover:bg-gray-200 dark:hover:bg-gray-600
                transition text-sm
                w-fit
            "
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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

            {text}
        </button>
    );
}
