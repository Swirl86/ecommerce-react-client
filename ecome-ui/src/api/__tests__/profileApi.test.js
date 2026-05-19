import { getFullProfile, updateAddress, updateProfile } from "@api/profileApi";
import { vi } from "vitest";

vi.mock("@api/apiClient", () => ({
    apiGet: vi.fn(),
    apiSend: vi.fn(),
}));

import { apiGet, apiSend } from "@api/apiClient";

describe("profileApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("getFullProfile calls apiGet with token", () => {
        getFullProfile("abc");
        expect(apiGet).toHaveBeenCalledWith("/users/me/full-profile", "abc");
    });

    // -------------------------
    // UPDATE PROFILE
    // -------------------------
    test("updateProfile returns JSON on success", async () => {
        apiSend.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ ok: true }),
        });

        const result = await updateProfile({ name: "A" }, "t");

        expect(apiSend).toHaveBeenCalledWith("PUT", "/users/me", { name: "A" }, "t");
        expect(result).toEqual({ ok: true });
    });

    test("updateProfile throws on failure", async () => {
        apiSend.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ message: "Bad" }),
        });

        await expect(updateProfile({}, "t")).rejects.toThrow("Bad");
    });

    // -------------------------
    // UPDATE ADDRESS
    // -------------------------
    test("updateAddress returns JSON on success", async () => {
        apiSend.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ ok: true }),
        });

        const result = await updateAddress({ city: "X" }, "t");

        expect(apiSend).toHaveBeenCalledWith("POST", "/users/me/address", { city: "X" }, "t");

        expect(result).toEqual({ ok: true });
    });

    test("updateAddress throws on failure", async () => {
        apiSend.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ message: "Oops" }),
        });

        await expect(updateAddress({}, "t")).rejects.toThrow("Oops");
    });
});
