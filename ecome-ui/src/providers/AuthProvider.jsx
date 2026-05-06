import { logoutRequest, refreshTokenRequest } from "@api/authApi";
import { AuthContext } from "@context/AuthContext";
import { useAuthStorage } from "@hooks/useAuthStorage";
import { useSessionTimers } from "@hooks/useSessionTimers";
import { useTokenRefresh } from "@hooks/useTokenRefresh";
import { useState } from "react";

function AuthProvider({ children }) {
    const { load, save, clear } = useAuthStorage();

    const initial = load();

    const [accessToken, setAccessToken] = useState(initial.accessToken || null);
    const [refreshToken, setRefreshToken] = useState(initial.refreshToken || null);
    const [user, setUser] = useState(initial.user || null);
    const [remember, setRemember] = useState(initial.remember || false);
    const [authLoading, setAuthLoading] = useState(true);

    const isAuthenticated = Boolean(accessToken);

    // -----------------------------------------------------
    // REFRESH TOKEN
    // -----------------------------------------------------
    async function refresh() {
        if (!refreshToken) return null;

        try {
            const data = await refreshTokenRequest(refreshToken);

            const auth = {
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                user,
            };

            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);

            save(auth, remember);

            return data.accessToken;
        } catch {
            logout("refresh_failed");
            return null;
        }
    }

    // -----------------------------------------------------
    // LOGOUT
    // -----------------------------------------------------
    async function logout(reason = "manual") {
        try {
            if (refreshToken) await logoutRequest(refreshToken);
        } catch {}

        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);

        clear();
    }

    // -----------------------------------------------------
    // LOGIN
    // -----------------------------------------------------
    function login(authResponse, rememberChoice) {
        const auth = {
            accessToken: authResponse.accessToken,
            refreshToken: authResponse.refreshToken,
            user: {
                id: authResponse.id,
                email: authResponse.email,
                role: authResponse.role,
            },
        };

        setAccessToken(auth.accessToken);
        setRefreshToken(auth.refreshToken);
        setUser(auth.user);
        setRemember(rememberChoice);

        save(auth, rememberChoice);
    }

    // -----------------------------------------------------
    // HOOKS
    // -----------------------------------------------------
    useTokenRefresh(refreshToken, refresh, setAuthLoading);

    const { showSessionWarning, countdown, extendSession, declineSession } = useSessionTimers(
        refreshToken,
        remember,
        refresh,
        logout
    );

    const value = {
        authLoading,
        accessToken,
        refreshToken,
        user,
        isAuthenticated,
        login,
        logout,
        refresh,
        extendSession,
        declineSession,
        showSessionWarning,
        countdown,
        remember,
        setRemember,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthProvider };
