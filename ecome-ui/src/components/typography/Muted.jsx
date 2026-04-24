// Muted — UI text / metadata
// Used for:
// - Price on product card
// - Small labels
// - Breadcrumbs
// - Footer text
// - Secondary information that should not take focus
// Perfect for subtle details.

export function Muted({ children }) {
    return <p className="text-sm text-gray-600 dark:text-gray-400">{children}</p>;
}
