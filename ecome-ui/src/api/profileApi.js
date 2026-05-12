import { apiGet, apiSend } from "./apiClient";

// GET full profile (with ETag support)
export function getFullProfile(token) {
    return apiGet("/users/me/full-profile", token);
}

// UPDATE profile (PUT /users/me)
export async function updateProfile(payload, token) {
    const res = await apiSend("PUT", "/users/me", payload, token);

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update profile");
    }

    return res.json();
}

// CREATE or UPDATE address (POST /users/me/address)
export async function updateAddress(payload, token) {
    const res = await apiSend("POST", "/users/me/address", payload, token);

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update address");
    }

    return res.json();
}
