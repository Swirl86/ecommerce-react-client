import { getProducts } from "@api/productsApi";
import { API_BASE_URL } from "@config/api";
import { useCachedFetch } from "@hooks/system/useCachedFetch";

export function useProducts({ categoryId, sort }) {
    const url = `${API_BASE_URL}/products/search?categoryId=${categoryId || ""}&sort=${sort || ""}`;

    const { data, loading, error } = useCachedFetch(url, {
        fetcher: () => getProducts({ categoryId, sort }),
    });

    return {
        products: data?.content || [],
        loading,
        error,
    };
}
