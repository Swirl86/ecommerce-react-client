import { useState } from "react";
import PageLayout from "../components/layout/PageLayout";
import ProductCard from "../components/products/ProductCard";
import SkeletonCard from "../components/products/SkeletonCard";
import ProductFilters from "../components/sidebar/ProductFilters";
import { H2 } from "../components/typography";
import { useProducts } from "../hooks/useProducts";

export default function Products() {
    const [categoryId, setCategoryId] = useState(null);
    const [sort, setSort] = useState("");

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

    return (
        <PageLayout
            sidebar={
                <ProductFilters selectedCategory={categoryId} onSelectCategory={setCategoryId} />
            }
        >
            {/* Header + sorting */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <H2>Products</H2>

                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="border px-3 py-2 rounded text-sm bg-white text-gray-900
                               hover:bg-sky-100 dark:hover:bg-gray-600
                               dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 transition"
                >
                    <option value="">Sort by price</option>
                    <option value="price,asc">Low to High</option>
                    <option value="price,desc">High to Low</option>
                </select>
            </div>

            {/* Productgrid */}
            {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                        <SkeletonCard key={i} />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </PageLayout>
    );
}
