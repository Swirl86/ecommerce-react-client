import { getProducts } from "@api/productsApi";
import { API_BASE_URL } from "@config/api";
import { useUI } from "@context/UIContext";
import { useCachedFetch } from "@hooks/useCachedFetch";

export function useProducts({ categoryId, sort }) {
    const { showError, setLoading } = useUI();

    const url = `${API_BASE_URL}/products/search?categoryId=${categoryId || ""}&sort=${sort || ""}`;

    const { data, loading, error } = useCachedFetch(url, {
        fetcher: async () => {
            try {
                setLoading(true);
                return await getProducts({ categoryId, sort });
            } catch (err) {
                showError("Could not load products");
                throw err;
            } finally {
                setLoading(false);
            }
        },
    });

    return {
        products: data?.content || [],
        loading,
        error,
    };
}
