import { API_BASE_URL } from "@config/api";
import { getCached, saveCached } from "@utils";

// -----------------------------------------------------
// API CLIENT (framework-agnostic, no React hooks)
// Provides GET with ETag caching + POST/PUT/DELETE helpers
// -----------------------------------------------------

let getAccessTokenFn = null;
let refreshFn = null;
let logoutFn = null;

export function configureApiAuth(config) {
    getAccessTokenFn = config?.getAccessToken || null;
    refreshFn = config?.refresh || null;
    logoutFn = config?.logout || null;
}

// -----------------------------------------------------
// INTERNAL FETCH WITH 401 INTERCEPTOR
// -----------------------------------------------------
async function doFetch(url, options = {}, retry = true) {
    // Resolve token (public mode → undefined)
    const token = getAccessTokenFn ? getAccessTokenFn() : options._token;

    const headers = {
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const res = await fetch(url, { ...options, headers });

    // No refresh logic needed
    if (res.status !== 401 || !retry || !refreshFn) {
        return res;
    }

    // Try refresh
    const newToken = await refreshFn();
    if (!newToken) {
        logoutFn?.("session_expired");
        return res;
    }

    // Retry with new token
    const retryToken = getAccessTokenFn ? getAccessTokenFn() : newToken;

    const retryHeaders = {
        ...(options.headers || {}),
        ...(retryToken ? { Authorization: `Bearer ${retryToken}` } : {}),
    };

    return fetch(url, { ...options, headers: retryHeaders });
}

// -----------------------------------------------------
// GET with ETag cache
// -----------------------------------------------------
export async function apiGet(path, token) {
    const url = `${API_BASE_URL}${path}`;
    const cached = getCached(url);

    const headers = {};
    if (cached?.etag) headers["If-None-Match"] = cached.etag;

    const res = await doFetch(url, { headers, _token: token }, true);

    if (res.status === 304 && cached) {
        return cached.data;
    }

    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }

    const data = await res.json();
    const etag = res.headers.get("ETag");

    if (etag) saveCached(url, data, etag);

    return data;
}

// -----------------------------------------------------
// POST / PUT / DELETE
// -----------------------------------------------------
export async function apiSend(method, path, body, token) {
    const url = `${API_BASE_URL}${path}`;

    const headers = {
        "Content-Type": "application/json",
    };

    return doFetch(
        url,
        {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
            _token: token,
        },
        true
    );
}
