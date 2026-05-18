import { addToWishlist, getWishlist, removeFromWishlist } from "@api/wishlistApi";
import { useAuth } from "@context/AuthContext";
import { useUI } from "@context/UIContext";
import { useCachedFetch } from "@hooks/system/useCachedFetch";

export function useWishlist() {
    const { accessToken } = useAuth();
    const { showSuccess, showError, showInfo } = useUI();

    if (!accessToken) {
        return { wishlist: [], loading: true, toggle: () => {} };
    }

    const {
        data: wishlist,
        loading,
        refetch,
    } = useCachedFetch("/wishlist", {
        fetcher: () => getWishlist(accessToken),
        token: accessToken,
        disableGlobalLoading: true,
    });

    const toggle = async (productId) => {
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
    };

    return { wishlist, loading, toggle };
}
