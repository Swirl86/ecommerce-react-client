import { getCategories } from "@api/categoriesApi";
import { API_BASE_URL } from "@config/api";
import { useUI } from "@context/UIContext";
import { useCachedFetch } from "@hooks/useCachedFetch";

export function useCategories() {
    const { showError, setLoading } = useUI();

    const url = `${API_BASE_URL}/categories`;

    const { data, loading, error } = useCachedFetch(url, {
        fetcher: async () => {
            try {
                setLoading(true);
                return await getCategories();
            } catch (err) {
                showError("Could not load categories");
                throw err;
            } finally {
                setLoading(false);
            }
        },
    });

    return {
        categories: data?.content || [],
        loading,
        error,
    };
}
