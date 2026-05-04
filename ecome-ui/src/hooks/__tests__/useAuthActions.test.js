import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useAuth } from "../../context/AuthContext";
import { useAuthActions } from "../useAuthActions";

vi.mock("../../context/AuthContext", () => ({
    useAuth: vi.fn(),
}));

global.fetch = vi.fn();

describe("useAuthActions", () => {
    const mockLogin = vi.fn();
    const mockLogout = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        useAuth.mockReturnValue({
            login: mockLogin,
            logout: mockLogout,
        });
    });

    test("login success", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                accessToken: "abc",
                refreshToken: "xyz",
                userId: 1,
                email: "test@example.com",
                role: "USER",
            }),
        });

        const { result } = renderHook(() => useAuthActions());

        act(() => {
            result.current.handleEmailChange({ target: { value: "test@example.com" } });
            result.current.handlePasswordChange({ target: { value: "password123" } });
        });

        await act(async () => {
            await result.current.login();
        });

        expect(mockLogin).toHaveBeenCalledWith(
            {
                accessToken: "abc",
                refreshToken: "xyz",
                user: {
                    id: 1,
                    email: "test@example.com",
                    role: "USER",
                },
            },
            false
        );
    });

    test("login 401 shows error", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
        });

        const { result } = renderHook(() => useAuthActions());

        act(() => {
            result.current.handleEmailChange({ target: { value: "test@example.com" } });
            result.current.handlePasswordChange({ target: { value: "password123" } });
        });

        await act(async () => {
            await result.current.login();
        });

        expect(result.current.error).toBe("Invalid email or password");
    });

    test("network error", async () => {
        fetch.mockRejectedValueOnce(new Error("network"));

        const { result } = renderHook(() => useAuthActions());

        act(() => {
            result.current.handleEmailChange({ target: { value: "test@example.com" } });
            result.current.handlePasswordChange({ target: { value: "password123" } });
        });

        await act(async () => {
            await result.current.login();
        });

        expect(result.current.error).toBe("Network error");
    });

    test("logout calls authLogout", async () => {
        const { result } = renderHook(() => useAuthActions());

        await act(async () => {
            await result.current.logout();
        });

        expect(mockLogout).toHaveBeenCalled();
    });
});
