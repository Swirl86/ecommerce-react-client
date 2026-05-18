const etagCache = new Map();

export function getCached(key) {
    return etagCache.get(key);
}

export function saveCached(key, data, etag) {
    etagCache.set(key, { data, etag });
}

export function deleteCached(key) {
    etagCache.delete(key);
}

export function clearEtagCache() {
    etagCache.clear();
}
