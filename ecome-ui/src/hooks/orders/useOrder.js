import { getOrderById } from "@api/orderApi";
import { API_BASE_URL } from "@config/api";
import { useAuth } from "@context/AuthContext";
import { useCachedFetch } from "@hooks/system/useCachedFetch";

export function useOrder(orderId) {
    const { accessToken } = useAuth();

    const url = `${API_BASE_URL}/orders/${orderId}`;

    const { data, loading, error, refetch } = useCachedFetch(url, {
        fetcher: () => getOrderById(orderId, accessToken),
        enabled: !!orderId && !!accessToken,
        token: accessToken,
    });

    return {
        order: data,
        loading,
        error,
        refetch,
    };
}
