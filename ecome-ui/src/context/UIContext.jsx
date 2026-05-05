import { BACKEND_RESTORED_DURATION, MESSAGE_DURATION } from "@config/constants";
import { createContext, useCallback, useContext, useState } from "react";

const UIContext = createContext(undefined);
UIContext.displayName = "UIContext";

export function UIProvider({ children }) {
    // -----------------------------
    // Global message system
    // -----------------------------
    const [message, setMessage] = useState(null); // { type: "error" | "success" | "info", text: "" }
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
    // Provider value
    // -----------------------------
    const value = {
        message,
        loading,
        setLoading,
        showError,
        showSuccess,
        showInfo,
        backendOffline,
        backendRestored,
        showBackendOffline,
        showBackendRestored,
    };

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export const useUI = () => useContext(UIContext);
