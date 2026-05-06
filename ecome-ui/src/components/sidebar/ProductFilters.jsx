import { useCategories } from "@hooks/useCategories";
import { Body, H3 } from "@typography";

export default function ProductFilters({ selectedCategory, onSelectCategory }) {
    const { categories, loading } = useCategories();

    return (
        <div className="space-y-8 sm:space-y-10">
            <div>
                <H3>Categories</H3>

                <ul className="space-y-2 mt-4 text-base sm:text-sm">
                    {/* ALL PRODUCTS */}
                    <li
                        onClick={() => onSelectCategory(null)}
                        className={[
                            "cursor-pointer transition rounded px-3 py-2",
                            selectedCategory === null
                                ? "bg-sky-100 text-sky-700 dark:bg-gray-700 dark:text-sky-300"
                                : "hover:text-sky-500 dark:hover:text-sky-300",
                        ].join(" ")}
                    >
                        <Body>All products</Body>
                    </li>

                    {/* LOADING */}
                    {loading && (
                        <li className="text-gray-500 dark:text-gray-400 px-3 py-2">
                            <Body>Loading categories…</Body>
                        </li>
                    )}

                    {/* DYNAMIC CATEGORIES */}
                    {!loading &&
                        categories.map((cat) => {
                            const isActive = selectedCategory === cat.id;

                            return (
                                <li
                                    key={cat.id}
                                    onClick={() => onSelectCategory(cat.id)}
                                    className={[
                                        "cursor-pointer transition rounded px-3 py-2",
                                        isActive
                                            ? "bg-sky-100 text-sky-700 dark:bg-gray-700 dark:text-sky-300"
                                            : "hover:text-sky-500 dark:hover:text-sky-300",
                                    ].join(" ")}
                                >
                                    <Body>{cat.name}</Body>
                                </li>
                            );
                        })}
                </ul>
            </div>
        </div>
    );
}
