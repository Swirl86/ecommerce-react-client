import { getProductById } from "@api/productsApi";
import { API_BASE_URL } from "@config/api";
import { useUI } from "@context/UIContext";
import { useCachedFetch } from "@hooks/useCachedFetch";

export function useProduct(id) {
    const { showError, setLoading } = useUI();

    const url = `${API_BASE_URL}/products/${id}`;

    const { data, loading, error } = useCachedFetch(url, {
        fetcher: async () => {
            try {
                setLoading(true);
                return await getProductById(id);
            } catch (err) {
                showError("Could not load product. Please try again later.");
                throw err;
            } finally {
                setLoading(false);
            }
        },
    });

    return {
        product: data,
        loading,
        error,
    };
}
