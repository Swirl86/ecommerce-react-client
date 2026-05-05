import { SESSION_DURATION } from "@config/constants";
import { useEffect } from "react";

export function useTokenRefresh(refreshToken, refreshFn, setAuthLoading) {
    // AUTO REFRESH
    useEffect(() => {
        if (!refreshToken) return;

        const interval = setInterval(() => {
            refreshFn();
        }, SESSION_DURATION);

        return () => clearInterval(interval);
    }, [refreshToken, refreshFn]);

    // REFRESH ON PAGE LOAD
    useEffect(() => {
        const run = async () => {
            if (refreshToken) await refreshFn();
            setAuthLoading(false);
        };

        run();
    }, []);
}
