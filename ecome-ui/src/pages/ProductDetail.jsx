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
import WishlistButton from "@ui/WishlistButton";
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
                    <H2>{product.name}</H2>
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
                        <button className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition">
                            Add to cart
                        </button>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
