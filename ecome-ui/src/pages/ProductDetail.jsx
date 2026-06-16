import { useCart } from "@hooks/cart/useCart";
import { useCategories } from "@hooks/domain/useCategories";
import { useProduct } from "@hooks/domain/useProduct";
import { useReviews } from "@hooks/domain/useReviews";
import PageContainer from "@layout/PageContainer";
import CollapsibleDescription from "@products/CollapsibleDescription";
import ProductImageViewer from "@products/ProductImageViewer";
import ProductReview from "@products/ProductReview";
import { H2, H3, Muted } from "@typography";
import BackButtonFloating from "@ui/BackButtonFloating";
import Breadcrumbs from "@ui/Breadcrumbs";
import QuantitySelector from "@ui/QuantitySelector";
import SkeletonCard from "@ui/SkeletonCard";
import StarRating from "@ui/StarRating";
import WishlistButton from "@ui/WishlistButton";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Load product data (with caching)
    const { product, loading } = useProduct(id);
    // Load reviews and average rating
    const { reviews, rating, loading: loadingReviews } = useReviews(id);
    // Load categories for breadcrumbs
    const { categories } = useCategories();

    const { cart, addItem } = useCart();
    const existingItem = cart?.find((item) => item.productId === product?.id);

    const [quantity, setQuantity] = useState(1);

    // Sorting from URL (for breadcrumbs)
    const sortFromUrl = searchParams.get("sort");
    const sortParam = sortFromUrl ? `&sort=${sortFromUrl}` : "";

    // Resolve category name for breadcrumbs
    const categoryName =
        categories?.find((c) => c.id === product?.categoryId)?.name ?? product?.name ?? "Unknown";

    const categoryId = product?.categoryId;

    if (loading || !product) {
        return (
            <PageContainer>
                <SkeletonCard />
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <div className="relative mb-6">
                <Breadcrumbs
                    items={[
                        { label: "Home", to: "/" },
                        { label: "Products", to: "/products" },
                        {
                            label: categoryName,
                            to: `/products?category=${categoryId}${sortParam}`,
                        },
                    ]}
                />

                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    <BackButtonFloating />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 animate-fadeIn">
                {/* LEFT: Image + floating wishlist */}
                <div className="relative">
                    <WishlistButton productId={product.id} variant="floating" />

                    <ProductImageViewer
                        images={product.imageUrls}
                        showThumbnails={true}
                        hoverZoom={false}
                    />
                </div>

                {/* RIGHT: Product info */}
                <div className="flex flex-col gap-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        {/* Title */}
                        <H2 className="m-0">{product.name}</H2>
                        {/* Rating */}
                        {rating > 0 && (
                            <div className="flex items-center gap-1">
                                <StarRating rating={rating} />
                                <span className="text-sm text-gray-500">({rating.toFixed(1)})</span>
                            </div>
                        )}
                    </div>

                    <Muted className="text-xl">${product.price}</Muted>

                    {/* Description */}
                    <CollapsibleDescription text={product.description} />

                    {/* Quantity selector */}
                    <div className="space-y-4">
                        <H3>Quantity</H3>
                        <QuantitySelector value={quantity} onChange={setQuantity} />
                    </div>

                    {/* CTA button */}
                    <div className="flex gap-4 mt-4">
                        <button
                            disabled={!product}
                            onClick={() => {
                                addItem(product, quantity);
                                setQuantity(0);
                            }}
                            className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition"
                        >
                            Add to cart
                        </button>
                    </div>

                    {existingItem && (
                        <div className="flex items-center gap-1 mt-1 text-green-600 text-sm">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 0 0-1.414 0L9 11.586 6.707 9.293a1 1 0 1 0-1.414 1.414l3 3a1 1 0 0 0 1.414 0l7-7a1 1 0 0 0 0-1.414Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span>
                                You have{" "}
                                <span className="font-semibold">{existingItem.quantity}</span> in
                                your cart
                            </span>
                        </div>
                    )}
                </div>
            </div>
            {/* Reviews */}
            <div className="mt-8">
                {reviews.length > 0 && <ProductReview reviews={reviews} rating={rating} />}
            </div>
        </PageContainer>
    );
}
