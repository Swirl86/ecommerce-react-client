import { useCategories } from "@hooks/domain/useCategories";
import { useProduct } from "@hooks/domain/useProduct";
import PageContainer from "@layout/PageContainer";
import CollapsibleDescription from "@products/CollapsibleDescription";
import ProductImageViewer from "@products/ProductImageViewer";
import { H2, H3, Muted } from "@typography";
import BackButtonFloating from "@ui/BackButtonFloating";
import Breadcrumbs from "@ui/Breadcrumbs";
import QuantitySelector from "@ui/QuantitySelector";
import SkeletonCard from "@ui/SkeletonCard";
import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

export default function ProductDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Load product data (with caching)
    const { product, loading } = useProduct(id);

    // Load categories for breadcrumbs
    const { categories } = useCategories();

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
                {/* LEFT: Main image + thumbnails */}
                <ProductImageViewer
                    images={product.imageUrls}
                    showThumbnails={true}
                    hoverZoom={false}
                />

                {/* RIGHT: Product info */}
                <div className="flex flex-col gap-6">
                    <H2>{product.name}</H2>
                    <Muted className="text-xl">${product.price}</Muted>

                    {/* Description */}
                    <CollapsibleDescription text={product.description} />

                    {/* Quantity selector */}
                    <div>
                        <H3>Quantity</H3>
                        <QuantitySelector value={quantity} onChange={setQuantity} />
                    </div>

                    {/* CTA buttons */}
                    <div className="flex gap-4 mt-4">
                        <button className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition">
                            Add to cart
                        </button>

                        <button
                            disabled
                            className="
                                px-3 py-3
                                rounded-lg
                                bg-gray-200 dark:bg-gray-700
                                text-gray-400 dark:text-gray-500
                                cursor-not-allowed
                                flex items-center justify-center
                                transition
                            "
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733C11.285 4.876 9.623 3.75 7.688 3.75 5.099 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
