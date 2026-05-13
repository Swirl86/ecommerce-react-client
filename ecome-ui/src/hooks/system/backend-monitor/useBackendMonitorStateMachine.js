import {
    HEALTHCHECK_BACKOFF_MAX,
    HEALTHCHECK_BACKOFF_START,
    OFFLINE_MODE_THRESHOLD,
} from "@config/constants";
import { useEffect, useRef, useState } from "react";

export function useBackendMonitorStateMachine(healthOk, offlineDuration) {
    const [online, setOnline] = useState(null);
    const [restoredAt, setRestoredAt] = useState(null);

    const backoffRef = useRef(HEALTHCHECK_BACKOFF_START);
    const wasOfflineRef = useRef(false);

    useEffect(() => {
        if (healthOk === null) return;

        // ONLINE → OFFLINE
        if (healthOk === false) {
            wasOfflineRef.current = true;

            backoffRef.current = Math.min(backoffRef.current * 2, HEALTHCHECK_BACKOFF_MAX);

            setOnline(false);
            return;
        }

        // OFFLINE → ONLINE
        if (healthOk === true) {
            if (wasOfflineRef.current) {
                setRestoredAt(Date.now());
                wasOfflineRef.current = false;
            }

            backoffRef.current = HEALTHCHECK_BACKOFF_START;
            setOnline(true);
        }
    }, [healthOk]);

    // offlineMode based on duration
    const offlineMode = offlineDuration > OFFLINE_MODE_THRESHOLD;

    return {
        online,
        restoredAt,
        offlineMode,
        backoff: backoffRef.current,
    };
}
