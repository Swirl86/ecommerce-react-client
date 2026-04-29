import { Link } from "react-router-dom";
import { IMAGE_PLACEHOLDER } from "../../config/constants";
import ProductImageViewer from "../products/ProductImageViewer";
import { H3, Muted } from "../typography";

export default function ProductCard({ product, selectedCategory, sort }) {
    const params = new URLSearchParams();

    if (selectedCategory != null) params.set("category", selectedCategory);
    if (sort) params.set("sort", sort);

    const query = params.toString();
    const link = `/products/${product.id}${query ? `?${query}` : ""}`;

    return (
        <Link to={link}>
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
                        initialImage={product.imageUrls?.[0] || IMAGE_PLACEHOLDER}
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
