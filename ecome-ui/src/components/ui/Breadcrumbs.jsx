import { Link } from "react-router-dom";

export default function Breadcrumbs({ items }) {
    return (
        <nav
            aria-label="Breadcrumb"
            className="text-sm text-gray-600 dark:text-gray-300 mb-4 overflow-x-auto"
        >
            <ol className="flex items-center gap-2 flex-wrap">
                {items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 truncate">
                        {item.to ? (
                            <Link
                                to={item.to}
                                className="hover:underline text-sky-600 dark:text-sky-300 truncate"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-gray-800 dark:text-gray-200 truncate">
                                {item.label}
                            </span>
                        )}

                        {i < items.length - 1 && <span>/</span>}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
