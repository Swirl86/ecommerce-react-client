import { IMAGE_PLACEHOLDER } from "@config/constants";
import ProductImageViewer from "@products/ProductImageViewer";
import { H3, Muted } from "@typography";
import StarRating from "@ui/StarRating";
import WishlistButton from "@ui/WishlistButton";
import { Link } from "react-router-dom";

export default function ProductCard({ product, selectedCategory, sort }) {
    const params = new URLSearchParams();

    if (selectedCategory != null) params.set("category", selectedCategory);
    if (sort) params.set("sort", sort);

    const query = params.toString();
    const link = `/products/${product.id}${query ? `?${query}` : ""}`;

    const dummyRating = product.averageRating ?? Math.random() * (5 - 1) + 1; // TODO implement real ratings

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
                    w-full
                "
            >
                {/* Product image */}
                <div
                    className="
                        relative overflow-hidden
                        rounded-lg
                        border border-gray-200 dark:border-gray-700
                        mb-3
                        aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3]
                    "
                >
                    <WishlistButton productId={product.id} variant="icon" />

                    <ProductImageViewer
                        images={product.imageUrls}
                        showThumbnails={false}
                        hoverZoom={true}
                        initialImage={product.imageUrls?.[0] || IMAGE_PLACEHOLDER}
                    />
                </div>

                {/* Product name */}
                <H3>{product?.name || "Unnamed Product"}</H3>

                {/* Rating */}
                <div className="flex justify-center items-center gap-1 mt-1">
                    <StarRating rating={dummyRating} />
                    <span className="text-sm text-gray-500">({dummyRating.toFixed(1)})</span>
                </div>

                {/* Price */}
                <Muted>{product?.price ? `$${product.price}` : "No price available"}</Muted>
            </div>
        </Link>
    );
}
