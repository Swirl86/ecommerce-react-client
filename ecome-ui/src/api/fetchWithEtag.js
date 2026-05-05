import { getCached, saveCached } from "@utils/etagCache";

export async function fetchWithEtag(url) {
    const cached = getCached(url);

    const headers = {};
    if (cached?.etag) {
        headers["If-None-Match"] = cached.etag;
    }

    const response = await fetch(url, { headers });

    if (response.status === 304) {
        return cached.data;
    }

    const data = await response.json();
    const etag = response.headers.get("ETag");

    if (etag) {
        saveCached(url, data, etag);
    }

    return data;
}
