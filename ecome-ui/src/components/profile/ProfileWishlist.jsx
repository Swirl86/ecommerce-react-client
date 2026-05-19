import { useProducts } from "@hooks/domain/useProducts";
import { useWishlist } from "@hooks/profile/useWishlist";
import ProductCard from "@products/ProductCard";
import { H2, Muted } from "@typography";
import ConfirmDialog from "@ui/ConfirmDialog";
import { useState } from "react";

export default function ProfileWishlist() {
    const { wishlist, clearAll } = useWishlist();
    const { products, loading: productsLoading } = useProducts({});

    const [confirmOpen, setConfirmOpen] = useState(false);

    const productIds = wishlist?.map((w) => w.productId) ?? [];
    const wishlistProducts = products?.filter((p) => productIds.includes(p.id)) ?? [];

    const handleClear = () => setConfirmOpen(true);

    const confirmDelete = async () => {
        await clearAll();
        setConfirmOpen(false);
    };

    return (
        <div className="animate-fadeIn bg-[var(--color-surface-alt)] border border-[var(--color-border)] rounded-xl shadow-sm p-8">
            <div className="flex items-center justify-between mb-4">
                <H2>Wishlist</H2>

                {wishlistProducts.length > 0 && (
                    <button
                        onClick={handleClear}
                        className="px-3 py-1.5 text-sm rounded-md bg-red-100 text-red-600 hover:bg-red-200 border border-red-300 transition"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {!productsLoading && wishlistProducts.length === 0 && (
                <Muted className="italic text-[var(--color-text-muted)]">
                    Your wishlist is empty.
                </Muted>
            )}

            {!productsLoading && wishlistProducts.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    {wishlistProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}

            {/* Confirm modal */}
            <ConfirmDialog
                open={confirmOpen}
                title="Clear wishlist"
                message="Are you sure you want to delete all items from your wishlist? This action cannot be undone."
                onConfirm={confirmDelete}
                onCancel={() => setConfirmOpen(false)}
            />
        </div>
    );
}
