import { API_BASE_URL } from "@config/api";
import { useEffect, useRef, useState } from "react";
import { useBackendMonitorStateMachine } from "./useBackendMonitorStateMachine";
import { useHealthcheck } from "./useHealthcheck";
import { useOfflineDuration } from "./useOfflineDuration";
import { usePolling } from "./usePolling";

export function useBackendMonitor() {
    const healthcheck = useHealthcheck();

    const [healthOk, setHealthOk] = useState(null);
    const [checking, setChecking] = useState(true);

    // --- OfflineSince must persist ---
    const offlineSince = useRef(null);

    useEffect(() => {
        if (healthOk === false && offlineSince.current === null) {
            offlineSince.current = Date.now();
        }
        if (healthOk === true) {
            offlineSince.current = null;
        }
    }, [healthOk]);

    // --- Initial healthcheck ---
    useEffect(() => {
        let mounted = true;

        (async () => {
            const ok = await healthcheck(`${API_BASE_URL}/health`);
            if (mounted) {
                setHealthOk(ok);
                setChecking(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [healthcheck]);

    // --- Polling every 5s ---
    usePolling(
        async () => {
            const ok = await healthcheck(`${API_BASE_URL}/health`);
            setHealthOk(ok);
        },
        5000,
        true
    );

    // ---  OfflineDuration now works correctly ---
    const offlineDuration = useOfflineDuration(offlineSince.current);

    // --- State machine ---
    const state = useBackendMonitorStateMachine(healthOk, offlineDuration);

    // ---  Return stable object ---
    return {
        ...state,
        offlineDuration,
        checking,
    };
}
