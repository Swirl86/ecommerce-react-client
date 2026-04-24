// Body — Standard body text
// Used for:
// - Product descriptions
// - Hero subtext
// - General text in sections
// - Longer paragraphs
// This is the primary text component.

export function Body({ children }) {
    return <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">{children}</p>;
}
