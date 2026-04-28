import { Link } from "react-router-dom";
import ProductImageViewer from "../products/ProductImageViewer";
import { H3, Muted } from "../typography";

export default function ProductCard({ product, selectedCategory, sort }) {
    const categoryParam = selectedCategory ? `category=${selectedCategory}` : "";
    const sortParam = sort ? `sort=${sort}` : "";

    const query = [categoryParam, sortParam].filter(Boolean).join("&");

    return (
        <Link to={`/products/${product.id}${query ? `?${query}` : ""}`}>
            <div
                className="
                group cursor-pointer text-center
                border border-gray-200 dark:border-gray-700
                rounded-xl p-4
                bg-white dark:bg-gray-800
                shadow-sm
                hover:shadow-lg
                hover:-translate-y-1
                transition-all duration-300
                animate-fadeIn
            "
            >
                {/* Product image */}
                <div
                    className="
                    relative overflow-hidden
                    rounded-lg
                    border border-gray-200 dark:border-gray-700
                    mb-3
                "
                >
                    <ProductImageViewer
                        images={product.imageUrls}
                        showThumbnails={false}
                        height="h-48"
                        hoverZoom={true}
                        rounded="rounded-lg"
                        initialImage={product.imageUrls?.[0]}
                    />
                </div>

                {/* Product name */}
                <H3>{product?.name || "Unnamed Product"}</H3>

                {/* Price */}
                <Muted>{product?.price ? `$${product.price}` : "No price available"}</Muted>
            </div>
        </Link>
    );
}
