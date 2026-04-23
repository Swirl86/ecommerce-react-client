import PageLayout from "../components/layout/PageLayout";
import ProductCard from "../components/products/ProductCard";
import ProductFilters from "../components/sidebar/ProductFilters";

export default function Products() {
    return (
        <PageLayout sidebar={<ProductFilters />}>
            {/* Header + sortering */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                    Women’s Pants
                </h2>

                <select className="border px-3 py-2 rounded text-sm bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                    <option>Sort by price</option>
                    <option>Low to High</option>
                    <option>High to Low</option>
                </select>
            </div>

            {/* Produktgrid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
                <ProductCard />
            </div>
        </PageLayout>
    );
}
