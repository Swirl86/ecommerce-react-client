import { getFullProfile } from "@api/profileApi";
import { API_BASE_URL } from "@config/api";
import { useAuth } from "@context/AuthContext";
import { useCachedFetch } from "@hooks/system/useCachedFetch";

export function useProfileData() {
    const { accessToken } = useAuth();

    const url = `${API_BASE_URL}/users/me/full-profile`;

    const { data, loading, error, refetch } = useCachedFetch(url, {
        fetcher: () => getFullProfile(accessToken),
        enabled: !!accessToken, // fetch only when logged in
        token: accessToken,
    });

    return {
        data,
        loading,
        error,
        refetch,
    };
}
