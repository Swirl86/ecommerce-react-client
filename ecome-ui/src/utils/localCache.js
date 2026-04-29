const DEFAULT_MAX_AGE = 1000 * 60 * 5; // 5 min

export function setLocalCache(key, data) {
    const payload = {
        timestamp: Date.now(),
        data,
    };
    localStorage.setItem(key, JSON.stringify(payload));
}

export function getLocalCache(key, maxAge = DEFAULT_MAX_AGE) {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    try {
        const cached = JSON.parse(raw);
        const isFresh = Date.now() - cached.timestamp < maxAge;
        return isFresh ? cached.data : null;
    } catch {
        return null;
    }
}
