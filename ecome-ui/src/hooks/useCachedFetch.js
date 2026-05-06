import { useUI } from "@context/UIContext";
import { getCached, saveCached } from "@utils/etagCache";
import { getLocalCache, setLocalCache } from "@utils/localCache";
import { useEffect, useState } from "react";

export function useCachedFetch(url, { maxAge = 1000 * 60 * 5, fetcher } = {}) {
    const [data, setData] = useState(null);
    const [loading, setLocalLoading] = useState(true);
    const [error, setError] = useState(null);

    const { setLoading: setGlobalLoading, showError } = useUI();

    useEffect(() => {
        let isMounted = true;

        async function load() {
            setLocalLoading(true);

            // ---------------------------------------------------------
            // 1. MEMORY CACHE (ETag)
            // ---------------------------------------------------------
            const memoryCached = getCached(url);
            if (memoryCached) {
                if (isMounted) {
                    setData(memoryCached.data);
                    setLocalLoading(false);
                }
                return;
            }

            // ---------------------------------------------------------
            // 2. LOCALSTORAGE CACHE
            // ---------------------------------------------------------
            const localCached = getLocalCache(url, maxAge);
            const hasLocalCache = Boolean(localCached);

            if (hasLocalCache) {
                if (isMounted) {
                    setData(localCached);
                    setLocalLoading(false);
                }
            } else {
                // No cache → show global loading
                setGlobalLoading(true);
            }

            // ---------------------------------------------------------
            // 3. FETCH FROM BACKEND
            // ---------------------------------------------------------
            try {
                const fresh = await fetcher(url);

                if (isMounted) {
                    setData(fresh);
                }

                // Save to both caches
                saveCached(url, fresh, fresh.etag);
                setLocalCache(url, fresh);
            } catch (err) {
                if (!hasLocalCache) {
                    if (isMounted) {
                        setError("Could not load data");
                        showError("Could not load data");
                    }
                }
            } finally {
                if (isMounted) {
                    setLocalLoading(false);
                }
                if (!hasLocalCache) {
                    setGlobalLoading(false);
                }
            }
        }

        load();

        return () => {
            isMounted = false;
        };
    }, [url]);

    return { data, loading, error };
}
