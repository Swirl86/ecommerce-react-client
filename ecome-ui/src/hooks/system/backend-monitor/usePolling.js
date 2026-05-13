import { useEffect, useRef } from "react";

export function usePolling(callback, interval, enabled = true) {
    const savedCallback = useRef(callback);
    const intervalRef = useRef(null);

    // Always keep latest callback
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Start/stop polling
    useEffect(() => {
        if (!enabled || !interval) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            return;
        }

        intervalRef.current = setInterval(() => {
            savedCallback.current();
        }, interval);

        return () => {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        };
    }, [enabled, interval]);
}
