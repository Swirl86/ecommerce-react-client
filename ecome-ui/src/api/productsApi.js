import { apiGet } from "./apiClient";

export function getProducts({ categoryId, sort }) {
    const params = new URLSearchParams();

    if (categoryId) params.append("categoryId", categoryId);
    if (sort) params.append("sort", sort);

    return apiGet(`/products/search?${params.toString()}`);
}

export function getProductById(id) {
    return apiGet(`/products/${id}`);
}
