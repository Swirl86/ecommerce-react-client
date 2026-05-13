import { HEALTHCHECK_TIMEOUT } from "@config/constants";
import { useCallback } from "react";

export function useHealthcheck() {
    const safeFetch = useCallback(async (url) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), HEALTHCHECK_TIMEOUT);

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
    }, []);

    const check = useCallback(
        async (url, retries = 2) => {
            for (let i = 0; i <= retries; i++) {
                const ok = await safeFetch(url);
                if (ok) return true;
                await new Promise((r) => setTimeout(r, 200));
            }
            return false;
        },
        [safeFetch]
    );

    return check;
}
