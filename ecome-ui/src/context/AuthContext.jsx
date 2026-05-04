import { createContext, useContext, useState } from "react";
import { logoutRequest, refreshTokenRequest } from "../api/authApi";
import { useAuthStorage } from "../hooks/useAuthStorage";
import { useSessionTimers } from "../hooks/useSessionTimers";
import { useTokenRefresh } from "../hooks/useTokenRefresh";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const { load, save, clear } = useAuthStorage();

    // -----------------------------------------------------
    // INITIAL LOAD
    // -----------------------------------------------------
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
    const refresh = async () => {
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
    };

    // -----------------------------------------------------
    // LOGOUT
    // -----------------------------------------------------
    const logout = async (reason = "manual") => {
        try {
            if (refreshToken) await logoutRequest(refreshToken);
        } catch {}

        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);

        clear();
    };

    // -----------------------------------------------------
    // LOGIN
    // -----------------------------------------------------
    const login = (authResponse, rememberChoice) => {
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
    };

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

    return (
        <AuthContext.Provider
            value={{
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
                authLoading,
                remember,
                setRemember,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
