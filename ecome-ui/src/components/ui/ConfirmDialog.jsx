import { createPortal } from "react-dom";

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel }) {
    if (!open) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fadeIn"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div
                className="
                relative
                bg-[var(--color-surface)]
                border border-[var(--color-border)]
                rounded-xl
                shadow-lg
                p-6
                w-[90%] max-w-md
                animate-fadeInUp
            "
            >
                <div className="flex items-center gap-3 mb-3">
                    <div
                        className="
                            w-10 h-10 flex items-center justify-center
                            rounded-full
                            bg-red-100 dark:bg-red-500/20
                            text-red-600 dark:text-red-400
                        "
                    >
                        {/* ⚠️ Icon */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10.29 3.86c.7-1.2 2.42-1.2 3.12 0l8.14 14.02c.68 1.17-.17 2.62-1.56 2.62H3.71c-1.39 0-2.24-1.45-1.56-2.62L10.29 3.86zM12 9c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1s1-.45 1-1v-4c0-.55-.45-1-1-1zm0 8a1.25 1.25 0 100-2.5A1.25 1.25 0 0012 17z"
                            />
                        </svg>
                    </div>

                    <h3 className="text-xl font-semibold text-[var(--color-text)]">{title}</h3>
                </div>

                <p className="text-[var(--color-text-muted)] mb-6 leading-relaxed">{message}</p>

                <div className="flex justify-end gap-3">
                    {/* Cancel */}
                    <button
                        onClick={onCancel}
                        className="
                            px-4 py-2 rounded-lg
                            border border-[var(--color-border)]
                            text-[var(--color-text)]
                            bg-[var(--color-surface-alt)]/40
                            hover:bg-[var(--color-surface-alt)]
                            transition
                        "
                    >
                        Cancel
                    </button>

                    {/* Delete all */}
                    <button
                        onClick={onConfirm}
                        className="
                            px-4 py-2 rounded-lg
                            text-white
                            bg-red-600
                            hover:bg-red-700
                            dark:bg-red-500
                            dark:hover:bg-red-600
                            transition
                        "
                    >
                        Delete all
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}
