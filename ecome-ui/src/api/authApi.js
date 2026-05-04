import { apiSend } from "./apiClient";

export async function loginRequest(email, password) {
    const res = await apiSend("POST", "/auth/login", { email, password }, null);

    if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.message || "Login failed");
    }

    return res.json();
}

export async function registerRequest(email, password) {
    const res = await apiSend("POST", "/auth/register", { email, password }, null);

    if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.message || "Registration failed");
    }

    return res.json();
}

export async function logoutRequest(refreshToken) {
    const res = await apiSend("POST", "/auth/logout", { refreshToken }, null);

    if (res.status === 204) return null; // No Content
    if (res.status === 200) {
        try {
            return await res.json();
        } catch {
            return null;
        }
    }

    throw new Error("Logout failed");
}

export async function refreshTokenRequest(refreshToken) {
    const res = await apiSend("POST", "/auth/refresh", { refreshToken }, null);

    if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.message || "Refresh failed");
    }

    return res.json();
}
