import { apiGet, apiSend } from "./apiClient";

// ---------------------------------------------------------
// CHECKOUT (POST /orders/checkout)
// ---------------------------------------------------------
export async function checkout(token) {
    const res = await apiSend("POST", "/orders/checkout", null, token);

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Checkout failed");
    }

    return res.json();
}

// ---------------------------------------------------------
// GET ORDER BY ID (GET /orders/{id})
// ---------------------------------------------------------
export function getOrderById(orderId, token) {
    return apiGet(`/orders/${orderId}`, token);
}

// ---------------------------------------------------------
// GET ACTIVE ORDERS (GET /orders/active)
// ---------------------------------------------------------
export function getActiveOrders(token) {
    return apiGet("/orders/active", token);
}

// ---------------------------------------------------------
// GET ORDER HISTORY (GET /orders/history)
// ---------------------------------------------------------
export function getOrderHistory(token, page = 0, size = 20) {
    return apiGet(`/orders/history?page=${page}&size=${size}`, token);
}
