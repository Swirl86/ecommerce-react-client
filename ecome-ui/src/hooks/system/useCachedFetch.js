import { useUI } from "@context/UIContext";
import { getCached } from "@utils/etagCache";
import { getLocalCache, setLocalCache } from "@utils/localCache";
import { useEffect, useRef, useState } from "react";

export function useCachedFetch(url, { maxAge = 1000 * 60 * 5, fetcher } = {}) {
    const [data, setData] = useState(null);
    const [loading, setLocalLoading] = useState(true);
    const [error, setError] = useState(null);

    const { setLoading: setGlobalLoading, showError, offlineMode, online } = useUI();

    // StrictMode-safe mounted flag
    const mountedRef = useRef(true);
    useEffect(() => {
        mountedRef.current = true;
        return () => {
            mountedRef.current = false;
        };
    }, []);

    // -----------------------------------------------------
    // Fetch fresh data
    // -----------------------------------------------------
    async function fetchFreshData(hasLocalCache) {
        try {
            if (!hasLocalCache) setGlobalLoading(true);

            const fresh = await fetcher(url);

            if (!mountedRef.current) return;

            setData(fresh);
            setLocalCache(url, fresh);
        } catch {
            if (!hasLocalCache && mountedRef.current) {
                setError("Could not load data");
                showError("Could not load data");
            }
        } finally {
            if (mountedRef.current) {
                setLocalLoading(false);
                if (!hasLocalCache) setGlobalLoading(false);
            }
        }
    }

    // -----------------------------------------------------
    // Main loader
    // -----------------------------------------------------
    useEffect(() => {
        if (online === null) return; // backend monitor not ready yet

        const memoryCached = getCached(url);
        if (memoryCached) {
            setLocalLoading(false);
            setData(memoryCached.data);
            return;
        }

        const localCached = getLocalCache(url, maxAge);
        const hasLocalCache = Boolean(localCached);

        // Offline or offlineMode → use cache only
        if (online === false || offlineMode) {
            if (hasLocalCache) {
                setLocalLoading(false);
                setData(localCached);
            } else {
                setLocalLoading(false);
                setError("Offline and no cached data available");
                showError("Offline and no cached data available");
            }
            return;
        }

        // Online with cache → SWR pattern
        if (hasLocalCache) {
            setLocalLoading(false);
            setData(localCached);
            fetchFreshData(true); // background refresh
            return;
        }

        // Online without cache
        setLocalLoading(true);
        fetchFreshData(false);
    }, [url, offlineMode, online, maxAge]);

    return { data, loading, error };
}
