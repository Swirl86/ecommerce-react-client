import { API_BASE_URL } from "@config/api";
import { useAuth } from "@context/AuthContext";
import { useUI } from "@context/UIContext";
import { syncBackendCartToLocal, syncLocalCartToBackend } from "@utils/cart/cartSync";

export function useAuthActions() {
    const { login: authLogin, logout: authLogout, accessToken } = useAuth();
    const { showError, showSuccess, setLoading } = useUI();

    async function login({ email, password, remember }) {
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.status === 401) {
                showError("Invalid email or password");
                return { ok: false };
            }

            if (!res.ok) {
                showError("Unexpected error");
                return { ok: false };
            }

            const data = await res.json();

            authLogin(
                {
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    user: {
                        id: data.userId,
                        email: data.email,
                        role: data.role,
                    },
                },
                remember
            );

            await syncLocalCartToBackend(data.accessToken);

            return { ok: true };
        } catch {
            showError("Network error");
            return { ok: false };
        } finally {
            setLoading(false);
        }
    }

    async function register({ email, password }) {
        setLoading(true);

        try {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (res.status === 409) {
                showError("That email is already registered. Try logging in instead.");
                return { ok: false };
            }

            if (res.status === 400) {
                showError("Some information is missing or invalid. Please review the form.");
                return { ok: false };
            }

            if (!res.ok) {
                showError("An unexpected error occurred. Please try again shortly.");
                return { ok: false };
            }

            const data = await res.json();

            authLogin(
                {
                    accessToken: data.accessToken,
                    refreshToken: data.refreshToken,
                    user: {
                        id: data.userId,
                        email: data.email,
                        role: data.role,
                    },
                },
                false
            );

            showSuccess("Account created");
            return { ok: true };
        } catch {
            showError("Network error");
            return { ok: false };
        } finally {
            setLoading(false);
        }
    }

    async function logout() {
        setLoading(true);
        await syncBackendCartToLocal(accessToken);
        await authLogout();
        setLoading(false);
    }

    return { login, register, logout };
}
