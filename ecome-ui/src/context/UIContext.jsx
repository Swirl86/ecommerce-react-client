import { createContext, useCallback, useContext, useState } from "react";

const UIContext = createContext();

export function UIProvider({ children }) {
    const [message, setMessage] = useState(null); // { type: "error" | "success" | "info", text: "" }
    const [loading, setLoading] = useState(false);

    const showMessage = useCallback((type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 4000);
    }, []);

    const showError = (text) => showMessage("error", text);
    const showSuccess = (text) => showMessage("success", text);
    const showInfo = (text) => showMessage("info", text);

    const [backendOffline, setBackendOffline] = useState(false);
    const [backendRestored, setBackendRestored] = useState(false);

    const showBackendOffline = () => {
        setBackendRestored(false);
        setBackendOffline(true);
    };

    const showBackendRestored = () => {
        setBackendOffline(false);
        setBackendRestored(true);
        setTimeout(() => setBackendRestored(false), 3000);
    };

    return (
        <UIContext.Provider
            value={{
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
            }}
        >
            {children}
        </UIContext.Provider>
    );
}

export const useUI = () => useContext(UIContext);
