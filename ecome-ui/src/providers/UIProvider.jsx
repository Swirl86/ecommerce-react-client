import { BACKEND_RESTORED_DURATION, MESSAGE_DURATION } from "@config/constants";
import { UIContext } from "@context/UIContext";
import { useCallback, useEffect, useRef, useState } from "react";

function UIProvider({ children, backendStatus }) {
    const online = backendStatus?.online ?? null;
    const offlineMode = backendStatus?.offlineMode ?? false;

    // -----------------------------
    // Global message system
    // -----------------------------
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const showMessage = useCallback((type, text) => {
        setMessage({ type, text });
        const timer = setTimeout(() => setMessage(null), MESSAGE_DURATION);
        return () => clearTimeout(timer);
    }, []);

    const showError = useCallback((text) => showMessage("error", text), [showMessage]);
    const showSuccess = useCallback((text) => showMessage("success", text), [showMessage]);
    const showInfo = useCallback((text) => showMessage("info", text), [showMessage]);

    // -----------------------------
    // Backend status badges
    // -----------------------------
    const [backendOffline, setBackendOffline] = useState(false);
    const [backendRestored, setBackendRestored] = useState(false);

    const showBackendOffline = useCallback(() => {
        setBackendRestored(false);
        setBackendOffline(true);
    }, []);

    const showBackendRestored = useCallback(() => {
        setBackendOffline(false);
        setBackendRestored(true);

        const timer = setTimeout(() => setBackendRestored(false), BACKEND_RESTORED_DURATION);
        return () => clearTimeout(timer);
    }, []);

    // -----------------------------
    // Track offline transitions
    // -----------------------------
    const wasOfflineRef = useRef(false);

    useEffect(() => {
        if (online === false) {
            wasOfflineRef.current = true;
            showBackendOffline();
        }
    }, [online, showBackendOffline]);

    useEffect(() => {
        if (online === true && wasOfflineRef.current) {
            showBackendRestored();
            wasOfflineRef.current = false;
        }
    }, [online, showBackendRestored]);

    // -----------------------------
    // Context value (stabil)
    // -----------------------------
    const value = {
        // Global UI
        message,
        loading,
        setLoading,
        showError,
        showSuccess,
        showInfo,

        // Backend badges
        backendOffline,
        backendRestored,
        showBackendOffline,
        showBackendRestored,

        // Backend monitor state
        online,
        offlineMode,
    };

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export { UIProvider };
