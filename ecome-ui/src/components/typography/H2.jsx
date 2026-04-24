// H2 — Page Headings
// Used for:
// - Product pages (e.g. “Women’s Pants”)
// - Section titles on subpages
// - Headings in PageLayout main content
// Perfect for creating clear hierarchy under H1.

export function H2({ children }) {
    return (
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-gray-100">
            {children}
        </h2>
    );
}
