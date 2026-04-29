import { getCategories } from "../api/categoriesApi";
import { API_BASE_URL } from "../config/api";
import { useCachedFetch } from "../hooks/useCachedFetch";

export function useCategories() {
    const url = `${API_BASE_URL}/categories`;

    const { data, loading, error } = useCachedFetch(url, {
        fetcher: () => getCategories(),
    });

    return {
        categories: data?.content || [],
        loading,
        error,
    };
}
