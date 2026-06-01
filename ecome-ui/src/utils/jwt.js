export function decodeJwt(token) {
    if (!token) return null;
    try {
        const [, payload] = token.split(".");
        return JSON.parse(atob(payload));
    } catch {
        return null;
    }
}

export function getTokenExpiry(token) {
    const decoded = decodeJwt(token);
    if (!decoded?.exp) return null;
    return decoded.exp * 1000; // sec → ms
}

export function getMsUntilExpiry(token) {
    const exp = getTokenExpiry(token);
    if (!exp) return null;
    return exp - Date.now();
}
