import { API_BASE_URL } from "@config/api";
import { useAuth } from "@context/AuthContext";
import { backendAdapter, localAdapter } from "@hooks/cart/cartAdapter";
import { useCachedFetch } from "@hooks/system/useCachedFetch";
import { CartUtils } from "@utils";
import { useState } from "react";

export function useCartInternal() {
    const { accessToken } = useAuth();
    const isLoggedIn = Boolean(accessToken);

    const [version, setVersion] = useState(0);

    const url = isLoggedIn ? `${API_BASE_URL}/cart` : "__local_cart__";

    const fetcher = async () => {
        if (!isLoggedIn) return localAdapter.get();
        return await fetch(`${API_BASE_URL}/cart`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        }).then((r) => r.json());
    };

    const { data, loading, error, refetch } = useCachedFetch(url, {
        fetcher,
        token: accessToken,
        disableGlobalLoading: true,
    });

    const onChange = () => {
        refetch();
        setVersion((v) => v + 1);
    };

    const adapter = isLoggedIn
        ? backendAdapter(accessToken, onChange)
        : {
              ...localAdapter,
              add: (product, quantity) => {
                  localAdapter.add(product, quantity);
                  onChange();
              },
              update: (id, quantity) => {
                  localAdapter.update(id, quantity);
                  onChange();
              },
              delete: (id) => {
                  localAdapter.delete(id);
                  onChange();
              },
              clear: () => {
                  localAdapter.clear();
                  onChange();
              },
          };

    const cartData = adapter.get(data);
    const items = cartData?.items ? [...cartData.items] : [];

    const subtotal = CartUtils.getSubtotal(items);
    const shipping = CartUtils.getShipping(subtotal);
    const tax = CartUtils.getTax(subtotal);
    const total = CartUtils.getTotal(items);

    return {
        cart: items,
        addItem: adapter.add,
        updateQuantity: adapter.update,
        deleteItem: adapter.delete,
        clear: adapter.clear,
        loading,
        error,
        refetch,
        version,

        subtotal,
        shipping,
        tax,
        total,
    };
}
