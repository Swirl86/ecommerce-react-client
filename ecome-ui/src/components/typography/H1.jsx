// H1 — Largest heading in the system
// Used for:
// - Hero sections (e.g. Home)
// - Large page headings
// - Important landing pages
// - Introductions to large sections

export function H1({ children }) {
    return (
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {children}
        </h1>
    );
}
