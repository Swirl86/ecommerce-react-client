import { apiGet, apiSend } from "./apiClient";

export function getCart(token) {
    return apiGet("/cart", token);
}

export async function addCartItem(productId, quantity, token) {
    const res = await apiSend("POST", "/cart/items", { productId, quantity }, token);

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to add item to cart");
    }

    return res.json();
}

export async function updateCartItem(itemId, quantity, token) {
    const res = await apiSend("PUT", `/cart/items/${itemId}`, { quantity }, token);

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update cart item");
    }

    return res.json();
}

export async function removeCartItem(itemId, token) {
    const res = await apiSend("DELETE", `/cart/items/${itemId}`, null, token);

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to remove cart item");
    }

    return res.json();
}

export async function clearCart(token) {
    const res = await apiSend("DELETE", "/cart", null, token);

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to clear cart");
    }

    return res.json();
}
