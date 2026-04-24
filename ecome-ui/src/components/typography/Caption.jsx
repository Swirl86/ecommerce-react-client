// Caption — Microtext
// Used for:
// - Badges (e.g. “NEW”, “SALE”)
// - Small UI details
// - Hint text under inputs
// - Mini labels in cards
// The smallest text size in the system.

export function Caption({ children }) {
    return <span className="text-xs text-gray-500 dark:text-gray-400">{children}</span>;
}
