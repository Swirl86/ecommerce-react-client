import { getCached, saveCached } from "@utils/etagCache";
import { getLocalCache, setLocalCache } from "@utils/localCache";
import { useEffect, useState } from "react";

export function useCachedFetch(url, { maxAge = 1000 * 60 * 5, fetcher } = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function load() {
            setLoading(true);

            // ---------------------------------------------------------
            // 1. MEMORY CACHE (ETag)
            // ---------------------------------------------------------
            const memoryCached = getCached(url);
            if (memoryCached) {
                setData(memoryCached.data);
                setLoading(false);
                return;
            }

            // ---------------------------------------------------------
            // 2. LOCALSTORAGE CACHE
            // ---------------------------------------------------------
            const localCached = getLocalCache(url, maxAge);
            if (localCached) {
                setData(localCached);
                // Continue to fetch fresh data in background to update cache
            }

            // ---------------------------------------------------------
            // 3. FETCH FROM BACKEND
            // ---------------------------------------------------------
            try {
                const fresh = await fetcher(url);

                setData(fresh);

                // Save to both caches
                saveCached(url, fresh, fresh.etag);
                setLocalCache(url, fresh);
            } catch (err) {
                if (!localCached) {
                    setError("Could not load data");
                }
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [url]);

    return { data, loading, error };
}
