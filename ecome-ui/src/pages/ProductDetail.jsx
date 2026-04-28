import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getProductById } from "../api/productsApi";
import PageLayout from "../components/layout/PageLayout";
import ProductImageViewer from "../components/products/ProductImageViewer";
import { H2, H3, Muted } from "../components/typography";
import BackButtonFloating from "../components/ui/BackButtonFloating";
import Breadcrumbs from "../components/ui/Breadcrumbs";
import QuantitySelector from "../components/ui/QuantitySelector";
import SkeletonCard from "../components/ui/SkeletonCard";
import { IMAGE_PLACEHOLDER } from "../config/constants";
import { useCategories } from "../hooks/useCategories";

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [searchParams] = useSearchParams();

    const navigate = useNavigate();

    const categories = useCategories();
    const categoryName =
        categories.find((c) => c.id === product?.categoryId)?.name || product?.name || "?";
    const categoryId = product?.categoryId;
    const sortFromUrl = searchParams.get("sort");
    const sortParam = sortFromUrl ? `&sort=${sortFromUrl}` : "";

    useEffect(() => {
        async function loadProduct() {
            try {
                const data = await getProductById(id);
                setProduct(data);
                setSelectedImage(data.imageUrls?.[0] || IMAGE_PLACEHOLDER);
            } catch (err) {
                setError(true);
            } finally {
                setLoading(false);
            }
        }

        loadProduct();
    }, [id]);

    if (error) {
        return (
            <PageLayout>
                <div className="p-6 bg-rose-100 text-rose-800 rounded">
                    Could not load product. Please try again later.
                </div>
            </PageLayout>
        );
    }

    if (loading) {
        return (
            <PageLayout>
                <SkeletonCard />
            </PageLayout>
        );
    }

    return (
        <PageLayout>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-fadeIn">
                {/* LEFT: Main image + thumbnails */}
                <ProductImageViewer
                    images={product.imageUrls}
                    showThumbnails={true}
                    height="h-[480px]"
                    hoverZoom={false}
                />

                {/* RIGHT: Product info */}
                <div className="flex flex-col gap-6">
                    <H2>{product.name}</H2>
                    <Muted className="text-xl">${product.price}</Muted>

                    {/* Description */}
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {product.description || "No description available."}
                    </p>

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
        </PageLayout>
    );
}
