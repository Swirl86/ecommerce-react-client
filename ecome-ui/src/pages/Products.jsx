import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import PageLayout from "../components/layout/PageLayout";
import ProductCard from "../components/products/ProductCard";
import ProductFilters from "../components/sidebar/ProductFilters";
import { H2 } from "../components/typography";
import SkeletonCard from "../components/ui/SkeletonCard";
import { useProducts } from "../hooks/useProducts";

export default function Products() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Load initial values from URL
    const categoryFromUrl = searchParams.get("category");
    const sortFromUrl = searchParams.get("sort");

    const [categoryId, setCategoryId] = useState(categoryFromUrl ? Number(categoryFromUrl) : null);
    const [sort, setSort] = useState(sortFromUrl || "");

    // Sync state from URL
    useEffect(() => {
        if (categoryFromUrl) {
            setCategoryId(Number(categoryFromUrl));
        }
        if (sortFromUrl) {
            setSort(sortFromUrl);
        }
    }, [categoryFromUrl, sortFromUrl]);

    // Fetch products
    const { products, loading, error } = useProducts({ categoryId, sort });

    if (error) {
        return (
            <PageLayout sidebar={<ProductFilters />}>
                <div className="p-6 bg-rose-100 text-rose-800 rounded">
                    Could not connect to backend. Please try again later.
                </div>
            </PageLayout>
        );
    }

    // Helper to update URL
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
            {/* Header + sorting */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <H2>Products</H2>

                <select
                    value={sort}
                    onChange={(e) => {
                        const newSort = e.target.value;
                        setSort(newSort);
                        updateUrl(categoryId, newSort);
                    }}
                    className="border px-3 py-2 rounded text-sm bg-white text-gray-900
                               hover:bg-sky-100 dark:hover:bg-gray-600
                               dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition"
                >
                    <option value="">Sort by price</option>
                    <option value="price,asc">Low to High</option>
                    <option value="price,desc">High to Low</option>
                </select>
            </div>

            {/* Product grid */}
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8">
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
