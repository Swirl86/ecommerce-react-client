import { DEFAULT_SHORT_MAX_AGE } from "@config/constants";
import { useUI } from "@context/UIContext";
import { deleteCached, getCached } from "@utils/etagCache";
import { getLocalCache, setLocalCache } from "@utils/localCache";
import { useEffect, useRef, useState } from "react";

export function useCachedFetch(
    url,
    { maxAge = DEFAULT_SHORT_MAX_AGE, fetcher, token, disableGlobalLoading = false } = {}
) {
    const disabled = !url || !fetcher;

    const [data, setData] = useState(null);
    const [loading, setLocalLoading] = useState(!disabled);
    const [error, setError] = useState(null);

    const { setLoading: setGlobalLoading, showError, offlineMode, online } = useUI();

    const cacheBustedRef = useRef(false);
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        return () => (mountedRef.current = false);
    }, []);

    // -----------------------------------------------------
    // Helpers
    // -----------------------------------------------------
    const applyData = (value) => {
        if (!mountedRef.current) return;
        setLocalLoading(false);
        setData(value);
    };

    const applyError = (msg) => {
        if (!mountedRef.current) return;
        setLocalLoading(false);
        setError(msg);
        showError(msg);
    };

    // -----------------------------------------------------
    // Fetch fresh data
    // -----------------------------------------------------
    async function fetchFreshData(hasLocalCache) {
        if (disabled) return;

        try {
            if (!hasLocalCache && !disableGlobalLoading) {
                setGlobalLoading(true);
            }

            const fresh = await fetcher(url);
            if (!mountedRef.current) return;

            setData(fresh);
            setLocalCache(url, fresh);
        } catch {
            if (!hasLocalCache) applyError("Could not load data");
        } finally {
            if (mountedRef.current && !hasLocalCache && !disableGlobalLoading) {
                setGlobalLoading(false);
            }
            if (mountedRef.current) setLocalLoading(false);
        }
    }

    // -----------------------------------------------------
    // Invalidate cache
    // -----------------------------------------------------
    function invalidate() {
        if (disabled) return;
        cacheBustedRef.current = true;
        deleteCached(url);
    }

    // -----------------------------------------------------
    // Manual refetch (used by EditProfileForm / EditAddressForm)
    // -----------------------------------------------------
    async function refetch() {
        if (disabled) return;
        invalidate();
        await fetchFreshData(false);
    }

    // -----------------------------------------------------
    // Main loader
    // -----------------------------------------------------
    useEffect(() => {
        if (disabled) return;
        if (online === null) return;

        // 1. Memory cache
        const memoryCached = getCached(url);
        if (memoryCached) {
            const canUseMemory = !cacheBustedRef.current || offlineMode || online === false;

            if (canUseMemory) {
                return applyData(memoryCached.data);
            }
        }

        // 2. Local cache
        const localCached = getLocalCache(url, maxAge);
        const hasLocalCache = Boolean(localCached);

        // 3. Offline
        if (online === false || offlineMode) {
            if (hasLocalCache) return applyData(localCached);
            return applyError("Offline and no cached data available");
        }

        // 4. Online with local cache → SWR
        if (hasLocalCache) {
            applyData(localCached);
            fetchFreshData(true);
            return;
        }

        // 5. Online without cache
        setLocalLoading(true);
        fetchFreshData(false);
    }, [url, offlineMode, online, maxAge, token]);

    return {
        data: disabled ? null : data,
        loading: disabled ? false : loading,
        error: disabled ? null : error,
        refetch: disabled ? () => {} : refetch,
    };
}
