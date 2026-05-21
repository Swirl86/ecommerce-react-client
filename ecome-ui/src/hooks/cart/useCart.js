import { getCart } from "@api/cartApi";
import { API_BASE_URL } from "@config/api";
import { useAuth } from "@context/AuthContext";
import { useCachedFetch } from "@hooks/system/useCachedFetch";
import { useState } from "react";
import { backendAdapter, localAdapter } from "./cartAdapter";

export function useCart() {
    const { accessToken } = useAuth();
    const isLoggedIn = Boolean(accessToken);

    const [version, setVersion] = useState(0);

    // Always provide a URL
    const url = isLoggedIn ? `${API_BASE_URL}/cart` : "__local_cart__";

    // Always provide a fetcher
    const fetcher = async () => {
        if (!isLoggedIn) {
            return { items: localAdapter.get() };
        }
        return getCart(accessToken);
    };

    const { data, loading, error, refetch } = useCachedFetch(url, {
        fetcher,
        token: accessToken,
        disableGlobalLoading: true,
    });

    const adapter = isLoggedIn
        ? backendAdapter(accessToken, () => {
              refetch();
              setVersion((v) => v + 1);
          })
        : {
              ...localAdapter,
              add: (...args) => {
                  localAdapter.add(...args);
                  setVersion((v) => v + 1);
              },
              update: (...args) => {
                  localAdapter.update(...args);
                  setVersion((v) => v + 1);
              },
              delete: (...args) => {
                  localAdapter.delete(...args);
                  setVersion((v) => v + 1);
              },
              clear: (...args) => {
                  localAdapter.clear(...args);
                  setVersion((v) => v + 1);
              },
          };

    return {
        cart: adapter.get(data),
        addItem: adapter.add,
        updateQuantity: adapter.update,
        deleteItem: adapter.delete,
        clear: adapter.clear,
        loading,
        error,
        refetch,
        version,
    };
}
