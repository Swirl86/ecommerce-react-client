import { API_BASE_URL } from "@config/api";
import {
    HEALTHCHECK_INITIAL_RETRY,
    HEALTHCHECK_INTERVAL_OFFLINE,
    HEALTHCHECK_INTERVAL_ONLINE,
    HEALTHCHECK_TIMEOUT,
} from "@config/constants";
import { useUI } from "@context/UIContext";
import { useEffect, useRef, useState } from "react";

export function useBackendStatus() {
    const [online, setOnline] = useState(null);
    const [checking, setChecking] = useState(true);

    const controllerRef = useRef(null);
    const intervalRef = useRef(null);
    const initializedRef = useRef(false);

    const { showBackendOffline, showBackendRestored } = useUI();

    // -----------------------------------------------------
    // HEALTH CHECK (safe fetch with timeout + abort)
    // -----------------------------------------------------
    async function doHealthCheck() {
        if (controllerRef.current?.abort) {
            controllerRef.current.abort();
        }

        const controller = new AbortController();
        controllerRef.current = controller;

        const timeoutId = setTimeout(() => controller.abort(), HEALTHCHECK_TIMEOUT);

        try {
            const res = await fetch(`${API_BASE_URL}/health`, {
                method: "GET",
                signal: controller.signal,
            });

            return res.ok;
        } catch {
            return false;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    // -----------------------------------------------------
    // START POLLING
    // -----------------------------------------------------
    function startPolling(isOnline) {
        const interval = isOnline ? HEALTHCHECK_INTERVAL_ONLINE : HEALTHCHECK_INTERVAL_OFFLINE;

        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(async () => {
            const ok = await doHealthCheck();
            setOnline(ok);
        }, interval);
    }

    // -----------------------------------------------------
    // REACT TO ONLINE STATE CHANGES (UI EVENTS)
    // -----------------------------------------------------
    useEffect(() => {
        if (!initializedRef.current) return;
        if (online === null) return;

        if (online === false) {
            showBackendOffline();
            startPolling(false);
        } else {
            showBackendRestored();
            startPolling(true);
        }
    }, [online]);

    // -----------------------------------------------------
    // INITIAL CHECK
    // -----------------------------------------------------
    useEffect(() => {
        async function runInitialCheck() {
            setChecking(true);

            for (let attempt = 1; attempt <= HEALTHCHECK_INITIAL_RETRY; attempt++) {
                const ok = await doHealthCheck();

                if (ok) {
                    setOnline(true);
                    setChecking(false);
                    initializedRef.current = true;
                    startPolling(true);
                    return;
                }
            }

            // All attempts failed
            setOnline(false);
            setChecking(false);
            showBackendOffline();
            initializedRef.current = true;
            startPolling(false);
        }

        runInitialCheck();

        return () => {
            clearInterval(intervalRef.current);
            if (controllerRef.current) controllerRef.current.abort();
        };
    }, []);

    return { online, checking };
}
