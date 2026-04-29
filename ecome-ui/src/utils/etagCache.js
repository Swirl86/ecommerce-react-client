const etagCache = new Map();

export function getCached(key) {
    return etagCache.get(key);
}

export function saveCached(key, data, etag) {
    etagCache.set(key, { data, etag });
}
