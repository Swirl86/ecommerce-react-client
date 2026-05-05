import { useUI } from "@context/UIContext";
import { useEffect, useRef } from "react";

export function useBackendBadge(online) {
    const { showBackendOffline, showBackendRestored } = useUI();
    const wasOffline = useRef(false);

    useEffect(() => {
        if (online === null) return;

        // Backend offline
        if (online === false) {
            wasOffline.current = true;
            showBackendOffline();
            return;
        }

        // Backend online
        if (online === true && wasOffline.current) {
            showBackendRestored();
        }
    }, [online, showBackendOffline, showBackendRestored]);
}
