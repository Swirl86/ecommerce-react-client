import CartMergeDialog from "@components/cart/CartMergeDialog";
import { BACKEND_RESTORED_DURATION, MESSAGE_DURATION } from "@config/constants";
import { UIContext } from "@context/UIContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function useMessages() {
    const [message, setMessage] = useState(null);

    const showMessage = useCallback((type, text) => {
        setMessage({ type, text });
        const timer = setTimeout(() => setMessage(null), MESSAGE_DURATION);
        return () => clearTimeout(timer);
    }, []);

    return {
        message,
        showError: (t) => showMessage("error", t),
        showSuccess: (t) => showMessage("success", t),
        showInfo: (t) => showMessage("info", t),
    };
}

function useBackendBadges(online) {
    const [backendOffline, setBackendOffline] = useState(false);
    const [backendRestored, setBackendRestored] = useState(false);
    const wasOfflineRef = useRef(false);

    const showBackendOffline = useCallback(() => {
        setBackendRestored(false);
        setBackendOffline(true);
    }, []);

    const showBackendRestored = useCallback(() => {
        setBackendOffline(false);
        setBackendRestored(true);
        setTimeout(() => setBackendRestored(false), BACKEND_RESTORED_DURATION);
    }, []);

    useEffect(() => {
        if (online === false) {
            wasOfflineRef.current = true;
            showBackendOffline();
        }
    }, [online, showBackendOffline]);

    useEffect(() => {
        if (online === true && wasOfflineRef.current) {
            wasOfflineRef.current = false;
            showBackendRestored();
        }
    }, [online, showBackendRestored]);

    return { backendOffline, backendRestored, showBackendOffline, showBackendRestored };
}

function UIProvider({ children, online, offlineMode }) {
    const [loading, setLoading] = useState(false);

    const { message, showError, showSuccess, showInfo } = useMessages();
    const { backendOffline, backendRestored, showBackendOffline, showBackendRestored } =
        useBackendBadges(online);

    const [cartMergeDialog, setCartMergeDialog] = useState(null);

    const showCartMergeDialog = (backend, local, callback) => {
        setCartMergeDialog({ backend, local, callback });
    };

    const hideCartMergeDialog = () => {
        setCartMergeDialog(null);
    };

    const value = useMemo(
        () => ({
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
            online,
            offlineMode,
            showCartMergeDialog,
            hideCartMergeDialog,
        }),
        [
            message,
            loading,
            showError,
            showSuccess,
            showInfo,
            backendOffline,
            backendRestored,
            showBackendOffline,
            showBackendRestored,
            online,
            offlineMode,
        ]
    );

    return (
        <UIContext.Provider value={value}>
            {children}
            {cartMergeDialog && (
                <CartMergeDialog
                    oldCart={cartMergeDialog.backend}
                    latestCart={cartMergeDialog.local}
                    onChoose={(choice) => {
                        cartMergeDialog.callback(choice);
                        hideCartMergeDialog();
                    }}
                />
            )}
        </UIContext.Provider>
    );
}

export { UIProvider };
