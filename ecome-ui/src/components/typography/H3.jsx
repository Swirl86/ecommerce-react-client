// H3 — Section Titles
// Used for:
// - Filter sections (ProductFilters)
// - Footer headings
// - Smaller sections in products, cards, modals
// - Headings in sidebars
// Good for dividing content into clear blocks.

export function H3({ children }) {
    return <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{children}</h3>;
}
