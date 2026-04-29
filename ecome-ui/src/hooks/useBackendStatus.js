import { useEffect, useRef, useState } from "react";
import { API_BASE_URL } from "../config/api";

export function useBackendStatus() {
    const [online, setOnline] = useState(true);
    const [checking, setChecking] = useState(true);

    const controllerRef = useRef(null);

    useEffect(() => {
        async function check() {
            setChecking(true);

            // Abort previous request if still running
            if (controllerRef.current) {
                controllerRef.current.abort();
            }

            const controller = new AbortController();
            controllerRef.current = controller;

            const timeout = setTimeout(() => controller.abort(), 3000);

            try {
                const res = await fetch(`${API_BASE_URL}/health`, {
                    method: "GET",
                    signal: controller.signal,
                });

                setOnline(res.ok);
            } catch {
                // If fetch fails (timeout, abort, network error)
                setOnline(false);
            } finally {
                clearTimeout(timeout);
                setChecking(false);
            }
        }

        // Initial check
        check();

        // Poll every 30 seconds
        const interval = setInterval(check, 30000);

        return () => {
            clearInterval(interval);
            if (controllerRef.current) {
                controllerRef.current.abort();
            }
        };
    }, []);

    return { online, checking };
}
