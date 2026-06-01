import { configureApiAuth } from "@api/apiClient";
import { logoutRequest, refreshTokenRequest } from "@api/authApi";
import { AuthContext } from "@context/AuthContext";
import { useAuthStorage } from "@hooks/auth/useAuthStorage";
import { useSessionTimers } from "@hooks/system/useSessionTimers";
import { useTokenRefresh } from "@hooks/system/useTokenRefresh";
import { useCallback, useEffect, useState } from "react";

export function AuthProvider({ children }) {
    const { load, save, clear } = useAuthStorage();

    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [user, setUser] = useState(null);
    const [remember, setRemember] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    const isAuthenticated = Boolean(accessToken);

    // -----------------------------------------------------
    // INITIAL LOAD
    // -----------------------------------------------------
    useEffect(() => {
        const initial = load();
        setAccessToken(initial.accessToken || null);
        setRefreshToken(initial.refreshToken || null);
        setUser(initial.user || null);
        setRemember(initial.remember || false);
    }, []);

    // -----------------------------------------------------
    // LOGOUT
    // -----------------------------------------------------
    const logout = useCallback(
        async (reason = "manual") => {
            try {
                const tokenToRevoke = refreshToken;
                if (tokenToRevoke) await logoutRequest(tokenToRevoke);
            } catch {}

            setAccessToken(null);
            setRefreshToken(null);
            setUser(null);
            clear();
        },
        [refreshToken, clear]
    );

    // -----------------------------------------------------
    // REFRESH
    // -----------------------------------------------------
    const refresh = useCallback(async () => {
        if (!refreshToken) return null;

        try {
            const data = await refreshTokenRequest(refreshToken);

            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);

            save(
                {
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    user,
                    remember,
                },
                remember
            );

            return data.accessToken;
        } catch {
            logout("refresh_failed");
            return null;
        }
    }, [refreshToken, user, remember, save, logout]);

    // -----------------------------------------------------
    // UPDATE USER
    // -----------------------------------------------------
    const updateAuthUser = useCallback(
        (updates) => {
            setUser((prev) => {
                if (!prev) return prev;

                const updatedUser = { ...prev, ...updates };

                save(
                    (prevState) => ({
                        ...prevState,
                        user: updatedUser,
                    }),
                    remember
                );

                return updatedUser;
            });
        },
        [remember, save]
    );

    // -----------------------------------------------------
    // LOGIN
    // -----------------------------------------------------
    const login = useCallback(
        (authResponse, rememberChoice) => {
            const auth = {
                accessToken: authResponse.accessToken,
                refreshToken: authResponse.refreshToken,
                user: {
                    id: authResponse.id,
                    email: authResponse.email,
                    role: authResponse.role,
                },
                remember: rememberChoice,
            };

            setAccessToken(auth.accessToken);
            setRefreshToken(auth.refreshToken);
            setUser(auth.user);
            setRemember(rememberChoice);

            save(auth, rememberChoice);
        },
        [save]
    );

    // -----------------------------------------------------
    // CONFIGURE API CLIENT
    // -----------------------------------------------------
    const getAccessToken = useCallback(() => accessToken, [accessToken]);

    useEffect(() => {
        if (!accessToken) {
            configureApiAuth(null);
            return;
        }

        configureApiAuth({
            getAccessToken,
            refresh,
            logout,
        });
    }, [accessToken, getAccessToken, refresh, logout]);

    // -----------------------------------------------------
    // HOOKS
    // -----------------------------------------------------
    useTokenRefresh(accessToken, refreshToken, refresh, setAuthLoading);

    const { showSessionWarning, countdown, extendSession, declineSession } = useSessionTimers(
        accessToken,
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
        updateAuthUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
