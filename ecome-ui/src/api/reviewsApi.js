import { apiGet, apiSend } from "./apiClient";

export function getReviews(productId) {
    return apiGet(`/products/${productId}/reviews`);
}

export function getAverageRating(productId) {
    return apiGet(`/products/${productId}/reviews/average`);
}

export function createReview(productId, review) {
    return apiSend("POST", `/products/${productId}/reviews`, review);
}

export function updateReview(productId, reviewId, review) {
    return apiSend("PUT", `/products/${productId}/reviews/${reviewId}`, review);
}
