import { API_BASE_URL } from "../config/api";
import { getCached, saveCached } from "../utils/etagCache";

// -----------------------------------------------------
// API CLIENT (framework-agnostic, no React hooks)
// Provides GET with ETag caching + POST/PUT/DELETE helpers
// -----------------------------------------------------

// GET with ETag cache
export async function apiGet(path, token) {
    const url = `${API_BASE_URL}${path}`;
    const cached = getCached(url);

    const headers = {};
    if (cached?.etag) {
        headers["If-None-Match"] = cached.etag;
    }
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, { headers });

    if (res.status === 304 && cached) return cached.data;
    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();
    const etag = res.headers.get("ETag");

    if (etag) saveCached(url, data, etag);

    return data;
}

// POST / PUT / DELETE
export async function apiSend(method, path, body, token) {
    const url = `${API_BASE_URL}${path}`;

    const res = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    return res;
}
