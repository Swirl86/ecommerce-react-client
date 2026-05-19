import { addToWishlist, clearWishlist, getWishlist, removeFromWishlist } from "@api/wishlistApi";
import { useAuth } from "@context/AuthContext";
import { useUI } from "@context/UIContext";
import { useCachedFetch } from "@hooks/system/useCachedFetch";

export function useWishlist() {
    const { accessToken } = useAuth();
    const { showError, showSuccess, showInfo } = useUI();

    // Not logged in → return safe defaults
    if (!accessToken) {
        return {
            wishlist: [],
            loading: true,
            toggle: () => {},
            clearAll: () => {},
        };
    }

    // Fetch wishlist (cached)
    const {
        data: wishlist,
        loading,
        refetch,
    } = useCachedFetch("/wishlist", {
        fetcher: () => getWishlist(accessToken),
        token: accessToken,
        disableGlobalLoading: true,
    });

    // -----------------------------
    // Toggle add/remove
    // -----------------------------
    async function toggle(productId) {
        try {
            const exists = wishlist?.some((w) => w.productId === productId);

            if (exists) {
                await removeFromWishlist(productId, accessToken);
            } else {
                await addToWishlist(productId, accessToken);
            }

            await refetch();
        } catch (err) {
            showError(err.message);
        }
    }

    // -----------------------------
    // Clear entire wishlist
    // -----------------------------
    async function clearAll() {
        try {
            await clearWishlist(accessToken);
            await refetch();
        } catch (err) {
            showError(err.message);
        }
    }

    return {
        wishlist: wishlist ?? [],
        loading,
        toggle,
        clearAll,
    };
}
