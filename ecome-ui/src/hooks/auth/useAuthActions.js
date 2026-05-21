import { clearCart, getCart } from "@api/cartApi";
import { API_BASE_URL } from "@config/api";
import { useAuth } from "@context/AuthContext";
import { useUI } from "@context/UIContext";
import {
    cartsAreIdentical,
    getLocalCart,
    syncBackendCartToLocal,
    syncLocalCartToBackend,
} from "@utils";

export function useAuthActions() {
    const { login: authLogin, logout: authLogout, accessToken } = useAuth();
    const { showError, showSuccess, setLoading, showCartMergeDialog } = useUI();

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

            // 1. Fetch carts
            const backend = await getCart(data.accessToken);
            const local = getLocalCart().items;

            // 2. Skip dialog if carts are identical
            if (cartsAreIdentical(backend.items, local)) {
                await syncBackendCartToLocal(data.accessToken);

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

                return { ok: true };
            }

            // 3. Show dialog only if both have items AND differ
            if (backend.items.length > 0 && local.length > 0) {
                return new Promise((resolve) => {
                    showCartMergeDialog(backend.items, local, async (choice) => {
                        if (choice === "backend") {
                            await syncBackendCartToLocal(data.accessToken);
                        } else if (choice === "local") {
                            await clearCart(data.accessToken);
                            await syncLocalCartToBackend(data.accessToken);
                        } else if (choice === "merge") {
                            await syncLocalCartToBackend(data.accessToken);
                        }

                        // Log in after the choice is made
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

                        resolve({ ok: true });
                    });
                });
            }

            // 4. Only local cart → synca local → backend
            if (local.length > 0) {
                await syncLocalCartToBackend(data.accessToken);
            }

            // 5. Only backend cart → synca backend → local
            if (backend.items.length > 0) {
                await syncBackendCartToLocal(data.accessToken);
            }

            // 6. Login
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
