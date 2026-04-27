import { apiGet } from "./apiClient";

export function getCategories() {
    return apiGet("/categories");
}
