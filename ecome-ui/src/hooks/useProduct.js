import { getProductById } from "@api/productsApi";
import { API_BASE_URL } from "@config/api";
import { useCachedFetch } from "@hooks/useCachedFetch";

export function useProduct(id) {
    const url = `${API_BASE_URL}/products/${id}`;

    const { data, loading, error } = useCachedFetch(url, {
        fetcher: () => getProductById(id),
    });

    return {
        product: data,
        loading,
        error,
    };
}
