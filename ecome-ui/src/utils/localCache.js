export function setLocalCache(key, data) {
    const payload = {
        timestamp: Date.now(),
        data,
    };
    localStorage.setItem(`cache:${key}`, JSON.stringify(payload));
}

export function getLocalCache(key, maxAge) {
    const raw = localStorage.getItem(`cache:${key}`);
    if (!raw) return null;

    try {
        const cached = JSON.parse(raw);
        const isFresh = Date.now() - cached.timestamp < maxAge;
        return isFresh ? cached.data : null;
    } catch (err) {
        return null;
    }
}
