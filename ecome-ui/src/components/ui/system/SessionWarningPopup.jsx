export default function SessionWarningPopup({
    onStay,
    onLogout,
    countdown,
    remember,
    setRemember,
}) {
    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-sm border border-[var(--color-border)]">
                {/* HEADER */}
                <h2 className="text-xl font-bold text-[var(--color-text)] mb-1">
                    Session expiring
                </h2>

                <p className="text-[var(--color-text-muted)] mb-6">
                    You will be logged out in{" "}
                    <span className="font-semibold text-[var(--color-primary)]">{countdown}</span>{" "}
                    seconds.
                </p>

                {/* TEMPORARY OPTION */}
                <div className="mb-6 p-4 rounded-xl border border-[var(--color-border)] bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center text-lg">
                            ⏳
                        </div>
                        <div>
                            <p className="font-semibold text-[var(--color-text)]">
                                Stay logged in (this time)
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)]">
                                Extends your session temporarily
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onStay}
                        className="w-full py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-dark)] transition"
                    >
                        Extend session
                    </button>
                </div>

                {/* PERMANENT OPTION */}
                <div className="mb-6 p-4 rounded-xl border border-[var(--color-border)] bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary-dark)] text-white flex items-center justify-center text-lg">
                            🔒
                        </div>
                        <div>
                            <p className="font-semibold text-[var(--color-text)]">
                                Always keep me logged in
                            </p>
                            <p className="text-xs text-[var(--color-text-muted)]">
                                Saves your preference for future visits
                            </p>
                        </div>
                    </div>

                    {/* Checkbox */}
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-[var(--color-text)]">
                            Enable permanent login
                        </span>

                        <input
                            type="checkbox"
                            checked={remember}
                            onChange={() => setRemember(!remember)}
                            className="w-5 h-5 accent-[var(--color-primary)]"
                        />
                    </div>

                    {/* Disabled until checked */}
                    <button
                        disabled={!remember}
                        onClick={onStay}
                        className={`
                            w-full py-2 rounded-lg font-medium transition
                            ${
                                remember
                                    ? "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]"
                                    : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                            }
                        `}
                    >
                        Stay logged in permanently
                    </button>
                </div>

                {/* LOG OUT */}
                <button
                    onClick={onLogout}
                    className="w-full py-2 rounded-lg border border-[var(--color-border)] text-[var(--color-text)] hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                    Log out
                </button>
            </div>
        </div>
    );
}
