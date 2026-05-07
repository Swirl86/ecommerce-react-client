import { API_BASE_URL } from "@config/api";
import {
    HEALTHCHECK_BACKOFF_MAX,
    HEALTHCHECK_BACKOFF_START,
    HEALTHCHECK_INITIAL_RETRY,
    HEALTHCHECK_INTERVAL_OFFLINE,
    HEALTHCHECK_INTERVAL_ONLINE,
    HEALTHCHECK_TIMEOUT,
    OFFLINE_MODE_THRESHOLD,
} from "@config/constants";
import { useEffect, useMemo, useRef, useState } from "react";
import { backendMonitorState } from "./backendMonitorState";

export function useBackendMonitor() {
    // Render-state
    const [online, setOnline] = useState(null);
    const [checking, setChecking] = useState(true);
    const [offlineSince, setOfflineSince] = useState(backendMonitorState.offlineSince);
    const [restoredAt, setRestoredAt] = useState(null);

    // Derived state (updated by timer)
    const [offlineDuration, setOfflineDuration] = useState(0);

    // Internal refs
    const controllerRef = useRef(null);
    const intervalRef = useRef(null);
    const durationTimerRef = useRef(null);

    const initializedRef = useRef(backendMonitorState.initialized);
    const backoffRef = useRef(backendMonitorState.backoff ?? HEALTHCHECK_BACKOFF_START);

    const offlineModeRef = useRef(false);
    const lastPollingModeRef = useRef(null);
    const wasOfflineRef = useRef(false);

    // -----------------------------------------------------
    // SAFE FETCH WITH TIMEOUT + SAFE ABORT
    // -----------------------------------------------------
    async function safeFetch(url, timeoutMs) {
        const controller = new AbortController();
        controllerRef.current = controller;

        const timeoutId = setTimeout(() => {
            if (controllerRef.current === controller) controller.abort();
        }, timeoutMs);

        try {
            const res = await fetch(url, {
                signal: controller.signal,
                cache: "no-store",
                mode: "cors",
            });

            return res.ok;
        } catch {
            return false;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    // -----------------------------------------------------
    // RETRY STRATEGY (3 attempts)
    // -----------------------------------------------------
    async function doHealthCheckWithRetry() {
        for (let i = 0; i < 3; i++) {
            const ok = await safeFetch(`${API_BASE_URL}/health`, HEALTHCHECK_TIMEOUT);
            if (ok) return true;
            await new Promise((r) => setTimeout(r, 300));
        }
        return false;
    }

    // -----------------------------------------------------
    // START POLLING (STRICTMODE-SAFE)
    // -----------------------------------------------------
    function startPolling(isOnline) {
        // Prevent restarting polling unnecessarily
        if (lastPollingModeRef.current === isOnline) return;
        lastPollingModeRef.current = isOnline;

        clearInterval(intervalRef.current);

        const interval = isOnline
            ? HEALTHCHECK_INTERVAL_ONLINE
            : Math.max(backoffRef.current, HEALTHCHECK_INTERVAL_OFFLINE);

        intervalRef.current = setInterval(async () => {
            if (!intervalRef.current) return;
            if (offlineModeRef.current) return;

            const ok = await doHealthCheckWithRetry();

            // Only update if changed
            setOnline((prev) => (prev !== ok ? ok : prev));

            if (!ok) {
                wasOfflineRef.current = true;

                setOfflineSince((prev) => {
                    const value = prev ?? backendMonitorState.offlineSince ?? Date.now();
                    backendMonitorState.offlineSince = value;
                    return value;
                });

                backoffRef.current = Math.min(backoffRef.current * 2, HEALTHCHECK_BACKOFF_MAX);
                backendMonitorState.backoff = backoffRef.current;
            } else {
                backoffRef.current = HEALTHCHECK_BACKOFF_START;
                backendMonitorState.backoff = backoffRef.current;
            }
        }, interval);
    }

    // -----------------------------------------------------
    // UPDATE offlineDuration EVERY SECOND
    // -----------------------------------------------------
    useEffect(() => {
        clearInterval(durationTimerRef.current);

        if (!offlineSince) {
            setOfflineDuration(0);
            return;
        }

        durationTimerRef.current = setInterval(() => {
            setOfflineDuration(Date.now() - offlineSince);
        }, 1000);

        return () => clearInterval(durationTimerRef.current);
    }, [offlineSince]);

    // -----------------------------------------------------
    // REACT TO ONLINE STATE CHANGES
    // -----------------------------------------------------
    useEffect(() => {
        if (!initializedRef.current) return;
        if (online === null) return;

        // Prevent re-triggering polling if online state didn't change
        if (online === lastPollingModeRef.current) return;

        if (online === false) {
            wasOfflineRef.current = true;

            setOfflineSince((prev) => {
                const value = prev ?? backendMonitorState.offlineSince ?? Date.now();
                backendMonitorState.offlineSince = value;
                return value;
            });

            startPolling(false);
        } else {
            if (wasOfflineRef.current) {
                setRestoredAt(Date.now());
                wasOfflineRef.current = false;
            }

            setOfflineSince(null);
            backendMonitorState.offlineSince = null;

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
                const ok = await doHealthCheckWithRetry();

                if (ok) {
                    setOnline(true);
                    setChecking(false);

                    initializedRef.current = true;
                    backendMonitorState.initialized = true;

                    startPolling(true);
                    return;
                }
            }

            const now = Date.now();
            setOnline(false);
            setChecking(false);
            setOfflineSince(now);
            backendMonitorState.offlineSince = now;

            initializedRef.current = true;
            backendMonitorState.initialized = true;

            startPolling(false);
        }

        runInitialCheck();

        return () => {
            clearInterval(intervalRef.current);
            clearInterval(durationTimerRef.current);
            if (controllerRef.current) controllerRef.current.abort();
        };
    }, []);

    // -----------------------------------------------------
    // DERIVED STATE
    // -----------------------------------------------------
    const offlineMode = offlineDuration > OFFLINE_MODE_THRESHOLD;
    offlineModeRef.current = offlineMode;

    // -----------------------------------------------------
    // MEMOIZED RETURN OBJECT (STABLE)
    // -----------------------------------------------------
    const backendStatus = useMemo(() => {
        return {
            online,
            checking,
            offlineSince,
            restoredAt,
            offlineDuration,
            offlineMode,
        };
    }, [
        online,
        checking,
        offlineSince,
        restoredAt,
        offlineMode, // offlineDuration excluded on purpose
    ]);

    return backendStatus;
}
