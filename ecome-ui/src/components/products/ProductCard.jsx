import { Link } from "react-router-dom";
import { IMAGE_PLACEHOLDER } from "../../config/constants";
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
                    <img
                        loading="lazy"
                        src={product?.imageUrls?.[0] || IMAGE_PLACEHOLDER}
                        alt={"Image of " + product?.name}
                        className="
                        w-full h-48 object-cover
                        transition-transform duration-300
                        group-hover:scale-105
                        fade-in
                    "
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
