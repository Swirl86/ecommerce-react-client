import { vi } from "vitest";
import { loginRequest, logoutRequest, refreshTokenRequest, registerRequest } from "../authApi";

vi.mock("@api/apiClient", () => ({
    apiSend: vi.fn(),
}));

import { apiSend } from "@api/apiClient";

describe("authApi", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // -------------------------
    // LOGIN
    // -------------------------
    test("loginRequest returns JSON on success", async () => {
        apiSend.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ token: "abc" }),
        });

        const result = await loginRequest("a@b.com", "pass");

        expect(apiSend).toHaveBeenCalledWith(
            "POST",
            "/auth/login",
            { email: "a@b.com", password: "pass" },
            null
        );

        expect(result).toEqual({ token: "abc" });
    });

    test("loginRequest throws error on failure", async () => {
        apiSend.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ message: "Invalid" }),
        });

        await expect(loginRequest("a", "b")).rejects.toThrow("Invalid");
    });

    // -------------------------
    // REGISTER
    // -------------------------
    test("registerRequest returns JSON on success", async () => {
        apiSend.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ ok: true }),
        });

        const result = await registerRequest("a", "b");
        expect(result).toEqual({ ok: true });
    });

    test("registerRequest throws error on failure", async () => {
        apiSend.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ message: "Bad" }),
        });

        await expect(registerRequest("a", "b")).rejects.toThrow("Bad");
    });

    // -------------------------
    // LOGOUT
    // -------------------------
    test("logoutRequest returns null on 204", async () => {
        apiSend.mockResolvedValueOnce({ status: 204 });

        const result = await logoutRequest("rt");
        expect(result).toBeNull();
    });

    test("logoutRequest returns JSON on 200", async () => {
        apiSend.mockResolvedValueOnce({
            status: 200,
            json: () => Promise.resolve({ ok: true }),
        });

        const result = await logoutRequest("rt");
        expect(result).toEqual({ ok: true });
    });

    test("logoutRequest throws on other status", async () => {
        apiSend.mockResolvedValueOnce({ status: 500 });

        await expect(logoutRequest("rt")).rejects.toThrow("Logout failed");
    });

    // -------------------------
    // REFRESH TOKEN
    // -------------------------
    test("refreshTokenRequest returns JSON on success", async () => {
        apiSend.mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve({ token: "new" }),
        });

        const result = await refreshTokenRequest("rt");
        expect(result).toEqual({ token: "new" });
    });

    test("refreshTokenRequest throws on failure", async () => {
        apiSend.mockResolvedValueOnce({
            ok: false,
            json: () => Promise.resolve({ message: "Expired" }),
        });

        await expect(refreshTokenRequest("rt")).rejects.toThrow("Expired");
    });
});
