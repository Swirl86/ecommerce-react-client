import { useCategories } from "../../hooks/useCategories";
import { Body, H3 } from "../typography";

export default function ProductFilters({ selectedCategory, onSelectCategory }) {
    const categories = useCategories();

    return (
        <div className="space-y-10">
            {/* Categories */}
            <div>
                <H3>Categories</H3>

                <ul className="space-y-1 mt-3">
                    {/* ALL PRODUCTS */}
                    <li
                        onClick={() => onSelectCategory(null)}
                        className={[
                            "cursor-pointer transition rounded px-2 py-1",
                            selectedCategory === null
                                ? "bg-sky-100 text-sky-700 dark:bg-gray-700 dark:text-sky-300"
                                : "hover:text-sky-500 dark:hover:text-sky-300",
                        ].join(" ")}
                    >
                        <Body>All products</Body>
                    </li>

                    {/* DYNAMIC CATEGORIES */}
                    {categories.map((cat) => {
                        const isActive = selectedCategory === cat.id;

                        return (
                            <li
                                key={cat.id}
                                onClick={() => onSelectCategory(cat.id)}
                                className={[
                                    "cursor-pointer transition rounded px-2 py-1",
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
