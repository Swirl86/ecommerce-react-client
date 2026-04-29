import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../config/api";

export function useBackendStatus() {
    const [online, setOnline] = useState(null); // Backend status: true / false / null (unknown)
    const [checking, setChecking] = useState(true); // Indicates if initial check is running

    const controllerRef = useRef(null); // Stores active AbortController

    async function doHealthCheck() {
        // Abort any previous request to avoid overlapping fetches
        if (controllerRef.current) {
            controllerRef.current.abort();
        }

        const controller = new AbortController();
        controllerRef.current = controller;

        // Safety timeout: abort request after 3 seconds
        const timeout = setTimeout(() => controller.abort(), 3000);

        try {
            const res = await fetch(`${API_BASE_URL}/health`, {
                method: "GET",
                signal: controller.signal,
            });

            clearTimeout(timeout);
            return res.ok; // true if backend responds with 2xx
        } catch {
            clearTimeout(timeout);
            return false; // Treat any error as offline
        }
    }

    useEffect(() => {
        async function runInitialCheck() {
            setChecking(true);

            // First check — may fail due to slow startup or network hiccup
            const first = await doHealthCheck();

            if (first) {
                setOnline(true);
                setChecking(false);
                return;
            }

            // Second check — avoids false offline blink on page load
            const second = await doHealthCheck();

            if (!second) {
                setOnline(false);
                setChecking(false);
                return;
            }

            // Backend came online between checks
            setOnline(true);
            setChecking(false);
        }

        // Run initial check immediately
        runInitialCheck();

        // Poll backend every 30 seconds
        const interval = setInterval(async () => {
            const ok = await doHealthCheck();
            setOnline(ok);
        }, 30000);

        return () => {
            clearInterval(interval);
            if (controllerRef.current) controllerRef.current.abort();
        };
    }, []);

    return { online, checking };
}
