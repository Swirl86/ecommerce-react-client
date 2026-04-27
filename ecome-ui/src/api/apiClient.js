import { API_BASE_URL } from "../config/api";

export async function apiGet(path) {
    try {
        const res = await fetch(`${API_BASE_URL}${path}`);

        if (!res.ok) {
            throw new Error(`API error: ${res.status}`);
        }

        return await res.json();
    } catch (err) {
        console.error("API connection failed:", err);
        throw err;
    }
}
