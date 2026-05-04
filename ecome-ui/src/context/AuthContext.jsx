import { createContext, useContext, useEffect, useRef, useState } from "react";
import { logoutRequest, refreshTokenRequest } from "../api/authApi";
import { SESSION_DURATION, WARNING_BEFORE } from "../config/constants";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const getStored = (key) => sessionStorage.getItem(key) || localStorage.getItem(key);

    const [accessToken, setAccessToken] = useState(() => getStored("accessToken"));
    const [refreshToken, setRefreshToken] = useState(() => getStored("refreshToken"));
    const [remember, setRemember] = useState(() => {
        return localStorage.getItem("remember") === "true";
    });

    const [user, setUser] = useState(() => {
        const stored = getStored("user");
        return stored ? JSON.parse(stored) : null;
    });

    const isAuthenticated = Boolean(accessToken);
    const [authLoading, setAuthLoading] = useState(true);

    const [showSessionWarning, setShowSessionWarning] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const sessionTimeoutRef = useRef(null);
    const countdownIntervalRef = useRef(null);
    const extendingRef = useRef(false);

    const warningTime = SESSION_DURATION - WARNING_BEFORE;

    // -----------------------------------------------------
    // LOGIN
    // -----------------------------------------------------
    const login = (authResponse, remember = false) => {
        setAccessToken(authResponse.accessToken);
        setRefreshToken(authResponse.refreshToken);

        const userData = {
            id: authResponse.id,
            email: authResponse.email,
            role: authResponse.role,
        };

        setUser(userData);

        const storage = remember ? localStorage : sessionStorage;

        storage.setItem("accessToken", authResponse.accessToken);
        storage.setItem("refreshToken", authResponse.refreshToken);
        storage.setItem("user", JSON.stringify(userData));
    };

    // -----------------------------------------------------
    // LOGOUT
    // -----------------------------------------------------
    const logout = async (reason = "manual/unknown") => {
        try {
            if (refreshToken) {
                await logoutRequest(refreshToken);
            }
        } catch (e) {
            console.debug("[AUTH] logoutRequest failed (ignored):", e);
        }

        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);

        localStorage.clear();
        sessionStorage.clear();

        clearTimeout(sessionTimeoutRef.current);
        clearInterval(countdownIntervalRef.current);
        sessionTimeoutRef.current = null;
        countdownIntervalRef.current = null;

        setShowSessionWarning(false);
    };

    // -----------------------------------------------------
    // REFRESH TOKEN
    // -----------------------------------------------------
    const refresh = async () => {
        if (!refreshToken) {
            return null;
        }

        try {
            const data = await refreshTokenRequest(refreshToken);

            setAccessToken(data.accessToken);
            setRefreshToken(data.refreshToken);

            if (sessionStorage.getItem("refreshToken")) {
                sessionStorage.setItem("accessToken", data.accessToken);
                sessionStorage.setItem("refreshToken", data.refreshToken);
            }
            if (localStorage.getItem("refreshToken")) {
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
            }

            return data.accessToken;
        } catch (e) {
            logout("refresh_failed");
            return null;
        }
    };

    // -----------------------------------------------------
    // EXTEND SESSION (Stay logged in)
    // -----------------------------------------------------
    const extendSession = async () => {
        extendingRef.current = true;

        await refresh();

        setShowSessionWarning(false);

        clearTimeout(sessionTimeoutRef.current);
        clearInterval(countdownIntervalRef.current);
        sessionTimeoutRef.current = null;
        countdownIntervalRef.current = null;

        sessionTimeoutRef.current = setTimeout(() => {
            setShowSessionWarning(true);
        }, warningTime);

        extendingRef.current = false;
    };

    const declineSession = () => {
        logout("decline_session");
    };

    // -----------------------------------------------------
    // EFFECT 1: HYDRATION COMPLETE
    // -----------------------------------------------------
    useEffect(() => {
        setAuthLoading(false);
    }, []);

    // -----------------------------------------------------
    // EFFECT 2: SHOW SESSION WARNING (only if NOT remember)
    // -----------------------------------------------------
    useEffect(() => {
        if (extendingRef.current) {
            return;
        }

        const isSession = sessionStorage.getItem("refreshToken");
        if (!isSession) return;

        clearTimeout(sessionTimeoutRef.current);

        sessionTimeoutRef.current = setTimeout(() => {
            setShowSessionWarning(true);
        }, warningTime);

        return () => {
            clearTimeout(sessionTimeoutRef.current);
        };
    }, [refreshToken]);

    // -----------------------------------------------------
    // EFFECT 3: COUNTDOWN WHEN WARNING IS VISIBLE
    // -----------------------------------------------------
    useEffect(() => {
        if (!showSessionWarning) {
            return;
        }

        const seconds = Math.floor(WARNING_BEFORE / 1000);
        setCountdown(seconds);

        clearInterval(countdownIntervalRef.current);

        countdownIntervalRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (!showSessionWarning) {
                    clearInterval(countdownIntervalRef.current);
                    return prev;
                }

                if (prev <= 1) {
                    clearInterval(countdownIntervalRef.current);
                    logout("countdown_zero");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearInterval(countdownIntervalRef.current);
        };
    }, [showSessionWarning]);

    // -----------------------------------------------------
    // EFFECT 4: AUTO-REFRESH TOKEN BEFORE EXPIRATION
    // -----------------------------------------------------
    useEffect(() => {
        if (!refreshToken) {
            return;
        }

        const interval = setInterval(() => {
            refresh();
        }, SESSION_DURATION);

        return () => {
            clearInterval(interval);
        };
    }, [refreshToken]);

    // -----------------------------------------------------
    // EFFECT 5: REFRESH ON PAGE LOAD
    // -----------------------------------------------------
    useEffect(() => {
        if (refreshToken) {
            refresh();
        }
    }, []);

    // -----------------------------------------------------
    // EFFECT 6: SYNC REMEMBER CHOICE AND TOKENS IN STORAGE
    // -----------------------------------------------------
    useEffect(() => {
        if (!accessToken || !refreshToken) return;

        // If user chooses to remember → move tokens to localStorage and clear sessionStorage
        if (remember) {
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            localStorage.setItem("user", JSON.stringify(user));

            sessionStorage.removeItem("accessToken");
            sessionStorage.removeItem("refreshToken");
            sessionStorage.removeItem("user");
        }

        // If user chooses to NOT remember → move tokens to sessionStorage
        if (!remember) {
            sessionStorage.setItem("accessToken", accessToken);
            sessionStorage.setItem("refreshToken", refreshToken);
            sessionStorage.setItem("user", JSON.stringify(user));

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("user");
        }

        localStorage.setItem("remember", remember);
    }, [remember]);

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
