import { getMsUntilExpiry } from "@utils/jwt";
import { useEffect, useRef } from "react";

const REFRESH_OFFSET_MS = 60 * 1000; // refresh 60s before expiry

export function useTokenRefresh(accessToken, refreshToken, refreshFn, setAuthLoading) {
    const timeoutRef = useRef(null);

    useEffect(() => {
        // Always clear previous timer
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        // No tokens → no refresh logic
        if (!accessToken || !refreshToken) {
            setAuthLoading(false);
            return;
        }

        const msUntilExpiry = getMsUntilExpiry(accessToken);

        // Token already expired → refresh immediately
        if (msUntilExpiry == null || msUntilExpiry <= 0) {
            (async () => {
                await refreshFn();
                setAuthLoading(false);
            })();
            return;
        }

        // Calculate refresh time
        const refreshIn = Math.max(msUntilExpiry - REFRESH_OFFSET_MS, 0);

        // Schedule refresh
        timeoutRef.current = setTimeout(async () => {
            await refreshFn();
            setAuthLoading(false);
        }, refreshIn);

        // Mark loading complete
        setAuthLoading(false);

        // Cleanup
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
            }
        };
    }, [accessToken, refreshToken, refreshFn, setAuthLoading]);
}
