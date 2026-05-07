import { useCallback } from "react";

export function useAuthStorage() {
    // Load from localStorage first, then sessionStorage
    const load = useCallback(() => {
        const remember = localStorage.getItem("remember") === "true";

        if (remember) {
            return {
                accessToken: localStorage.getItem("accessToken"),
                refreshToken: localStorage.getItem("refreshToken"),
                user: JSON.parse(localStorage.getItem("user") || "null"),
                remember: true,
            };
        }

        return {
            accessToken: sessionStorage.getItem("accessToken"),
            refreshToken: sessionStorage.getItem("refreshToken"),
            user: JSON.parse(sessionStorage.getItem("user") || "null"),
            remember: false,
        };
    }, []);

    // Save tokens + user depending on remember
    const save = useCallback((auth, remember) => {
        if (remember) {
            localStorage.setItem("accessToken", auth.accessToken);
            localStorage.setItem("refreshToken", auth.refreshToken);
            localStorage.setItem("user", JSON.stringify(auth.user));
            localStorage.setItem("remember", "true");

            sessionStorage.clear();
        } else {
            sessionStorage.setItem("accessToken", auth.accessToken);
            sessionStorage.setItem("refreshToken", auth.refreshToken);
            sessionStorage.setItem("user", JSON.stringify(auth.user));

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
            localStorage.removeItem("remember");
        }
    }, []);

    // Clear both storages
    const clear = useCallback(() => {
        localStorage.clear();
        sessionStorage.clear();
    }, []);

    return { load, save, clear };
}
