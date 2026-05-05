import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../config/api";
import {
    HEALTHCHECK_INITIAL_RETRY,
    HEALTHCHECK_INTERVAL_OFFLINE,
    HEALTHCHECK_INTERVAL_ONLINE,
    HEALTHCHECK_TIMEOUT,
} from "../config/constants";
import { useUI } from "../context/UIContext";

export function useBackendStatus() {
    const [online, setOnline] = useState(null);
    const [checking, setChecking] = useState(true);

    const controllerRef = useRef(null);
    const firstRun = useRef(true);
    const intervalRef = useRef(null);

    const { showBackendOffline, showBackendRestored } = useUI();

    async function doHealthCheck(source = "unknown") {
        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        const controller = new AbortController();
        controllerRef.current = controller;

        const timeout = setTimeout(() => controller.abort(), HEALTHCHECK_TIMEOUT);

        try {
            const res = await fetch(`${API_BASE_URL}/health`, {
                method: "GET",
                signal: controller.signal,
            });

            clearTimeout(timeout);

            return res.ok;
        } catch {
            clearTimeout(timeout);

            return false;
        }
    }

    function startPolling(isOnline) {
        const interval = isOnline ? HEALTHCHECK_INTERVAL_ONLINE : HEALTHCHECK_INTERVAL_OFFLINE;

        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(async () => {
            const ok = await doHealthCheck("polling");

            setOnline((prev) => {
                if (!firstRun.current) {
                    if (prev === true && !ok) {
                        showBackendOffline();
                        startPolling((isOnline = false)); // Change to faster interval when offline
                    }
                    if (prev === false && ok) {
                        showBackendRestored();
                        startPolling((isOnline = true)); // Change to slower interval when online
                    }
                }
                return ok;
            });
        }, interval);
    }

    useEffect(() => {
        async function runInitialCheck() {
            setChecking(true);

            for (let attempt = 1; attempt <= HEALTHCHECK_INITIAL_RETRY; attempt++) {
                const ok = await doHealthCheck(`initial-${attempt}`);

                if (ok) {
                    setOnline(true);
                    setChecking(false);
                    firstRun.current = false;
                    startPolling(true);
                    return;
                }
            }

            setOnline(false);
            setChecking(false);
            showBackendOffline();
            firstRun.current = false;
            startPolling(false);
        }

        runInitialCheck();

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (controllerRef.current) controllerRef.current.abort();
        };
    }, []);

    return { online, checking };
}
