import { API_BASE_URL } from "@config/api";
import { useAuth } from "@context/AuthContext";
import { useUI } from "@context/UIContext";
import { useEffect, useState } from "react";

export function useProfileData() {
    const { accessToken } = useAuth();
    const { setLoading, showError } = useUI();

    const [data, setData] = useState(null);

    useEffect(() => {
        if (!accessToken) return;

        async function fetchProfile() {
            try {
                setLoading(true);

                const res = await fetch(`${API_BASE_URL}/users/me/full-profile`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                if (!res.ok) {
                    showError("Could not load profile");
                    return;
                }

                const json = await res.json();
                setData(json);
            } catch {
                showError("Network error while loading profile");
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [accessToken, setLoading, showError]);

    return { data };
}
