import { API_BASE_URL } from "../config/api";
import { getCached, saveCached } from "../utils/etagCache";

export async function apiGet(path) {
    const url = `${API_BASE_URL}${path}`;
    const cached = getCached(url);

    const headers = {};
    if (cached?.etag) {
        headers["If-None-Match"] = cached.etag;
    }

    try {
        const res = await fetch(url, { headers });

        // 304 → use cache
        if (res.status === 304 && cached) {
            return cached.data;
        }

        if (!res.ok) {
            throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        const etag = res.headers.get("ETag");

        if (etag) {
            saveCached(url, data, etag);
        }

        return data;
    } catch (err) {
        console.error("API connection failed:", err);
        throw err;
    }
}
