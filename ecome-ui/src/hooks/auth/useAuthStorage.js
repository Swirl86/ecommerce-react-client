import { LOCAL_AUTH_KEY } from "@config/constants";
import { useCallback } from "react";

export function useAuthStorage() {
    const load = useCallback(() => {
        // remember controls *where* auth is located
        const localRaw = localStorage.getItem(LOCAL_AUTH_KEY);
        if (localRaw) return JSON.parse(localRaw);

        const sessionRaw = sessionStorage.getItem(LOCAL_AUTH_KEY);
        if (sessionRaw) return JSON.parse(sessionRaw);

        return {
            accessToken: null,
            refreshToken: null,
            user: null,
            remember: false,
        };
    }, []);

    // Save tokens + user depending on remember
    const save = useCallback((auth, remember) => {
        const data = { ...auth, remember };

        if (remember) {
            localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(data));
            sessionStorage.removeItem(LOCAL_AUTH_KEY);
        } else {
            sessionStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(data));
            localStorage.removeItem(LOCAL_AUTH_KEY);
        }
    }, []);

    // Clear both storages
    const clear = useCallback(() => {
        localStorage.removeItem(LOCAL_AUTH_KEY);
        sessionStorage.removeItem(LOCAL_AUTH_KEY);
    }, []);

    return { load, save, clear };
}
