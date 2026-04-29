import { useEffect, useRef, useState } from "react";

export function useBackendBadge(online) {
    const [showOffline, setShowOffline] = useState(false);
    const [showRestored, setShowRestored] = useState(false);

    const wasOffline = useRef(false); // Tracks if backend has ever been offline

    useEffect(() => {
        // Ignore unknown state (initial load)
        if (online === null) return;

        // Backend is offline
        if (online === false) {
            wasOffline.current = true;
            setShowOffline(true);
            setShowRestored(false);
            return;
        }

        // Backend is online
        if (online === true) {
            // Only show "restored" if backend was previously offline
            if (wasOffline.current) {
                setShowOffline(false);
                setShowRestored(true);

                // Hide restored badge after 5 seconds
                const timer = setTimeout(() => setShowRestored(false), 5000);
                return () => clearTimeout(timer);
            }

            // Backend has never been offline → show nothing
            setShowOffline(false);
            setShowRestored(false);
        }
    }, [online]);

    return { showOffline, showRestored };
}
