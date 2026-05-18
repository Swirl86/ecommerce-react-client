import { apiGet, apiSend } from "./apiClient";

export function getWishlist(token) {
    return apiGet("/wishlist", token);
}

export function addToWishlist(productId, token) {
    return apiSend("POST", `/wishlist/${productId}`, null, token);
}

export function removeFromWishlist(productId, token) {
    return apiSend("DELETE", `/wishlist/${productId}`, null, token);
}

export function clearWishlist(token) {
    return apiSend("DELETE", "/wishlist", null, token);
}
