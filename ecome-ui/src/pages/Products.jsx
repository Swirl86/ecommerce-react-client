import { useProducts } from "@hooks/domain/useProducts";
import PageLayout from "@layout/PageLayout";
import ProductCard from "@products/ProductCard";
import ProductFilters from "@sidebar/ProductFilters";
import { H2 } from "@typography";
import SkeletonCard from "@ui/SkeletonCard";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Products() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Mobile filter menu
    const [filtersOpen, setFiltersOpen] = useState(false);

    // Read URL params
    const categoryFromUrl = searchParams.get("category");
    const sortFromUrl = searchParams.get("sort");

    // Local state synced with URL
    const [categoryId, setCategoryId] = useState(categoryFromUrl ? Number(categoryFromUrl) : null);
    const [sort, setSort] = useState(sortFromUrl || "");

    // Sync state when URL changes (e.g. back button)
    useEffect(() => {
        setCategoryId(categoryFromUrl ? Number(categoryFromUrl) : null);
        setSort(sortFromUrl || "");
    }, [categoryFromUrl, sortFromUrl]);

    // Fetch products
    const { products, loading, error } = useProducts({ categoryId, sort });

    // URL helper
    const updateUrl = (newCategory, newSort) => {
        const params = new URLSearchParams();

        if (newCategory !== null) params.set("category", newCategory);
        if (newSort) params.set("sort", newSort);

        const query = params.toString();
        navigate(query ? `/products?${query}` : "/products");
    };

    return (
        <PageLayout
            sidebar={
                <ProductFilters
                    selectedCategory={categoryId}
                    onSelectCategory={(id) => {
                        setCategoryId(id);
                        updateUrl(id, sort);
                    }}
                />
            }
        >
            {/* Mobile slide-over menu */}
            {filtersOpen && (
                <div className="fixed inset-0 bg-black/40 z-50 sm:hidden">
                    <div className="absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 p-4 shadow-xl">
                        <button
                            className="mb-4 text-sm text-gray-600 dark:text-gray-300"
                            onClick={() => setFiltersOpen(false)}
                        >
                            Close
                        </button>

                        <ProductFilters
                            selectedCategory={categoryId}
                            onSelectCategory={(id) => {
                                setCategoryId(id);
                                updateUrl(id, sort);
                                setFiltersOpen(false);
                            }}
                        />
                    </div>
                </div>
            )}
            {/* Header + sorting + mobile filter button */}
            <div className="flex justify-between items-center mb-6">
                <H2>Products</H2>

                {/* Right side: sort + filter button */}
                <div className="flex items-center gap-3">
                    {/* Mobile filter button */}
                    <button
                        className="lg:hidden px-4 py-2 rounded bg-gray-200 dark:bg-gray-700"
                        onClick={() => setFiltersOpen(true)}
                    >
                        Filters
                    </button>

                    {/* Sorting*/}
                    <select
                        value={sort}
                        onChange={(e) => {
                            const newSort = e.target.value;
                            setSort(newSort);
                            updateUrl(categoryId, newSort);
                        }}
                        className="
                            border px-3 py-2 rounded text-sm bg-white text-gray-900
                            hover:bg-sky-100 dark:hover:bg-gray-600
                            dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100
                            transition
                        "
                    >
                        <option value="">Sort by price</option>
                        <option value="price,asc">Low to High</option>
                        <option value="price,desc">High to Low</option>
                    </select>
                </div>
            </div>
            {/* Product grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {[...Array(6)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            selectedCategory={categoryId}
                            sort={sort}
                        />
                    ))}
                </div>
            )}
        </PageLayout>
    );
}
