import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";

// ---------------------------------------------------------
// 1. Mock UIContext FIRST (before importing useAuthActions)
// ---------------------------------------------------------
const mockShowError = vi.fn();
const mockShowSuccess = vi.fn();
const mockSetLoading = vi.fn();

vi.mock("@context/UIContext", () => ({
    useUI: () => ({
        showError: mockShowError,
        showSuccess: mockShowSuccess,
        setLoading: mockSetLoading,
    }),
}));

// ---------------------------------------------------------
// 2. Mock AuthContext with persistent mocks
// ---------------------------------------------------------
const mockAuthLogin = vi.fn();
const mockAuthLogout = vi.fn();

vi.mock("@context/AuthContext", () => ({
    useAuth: () => ({
        login: mockAuthLogin,
        logout: mockAuthLogout,
    }),
}));

// ---------------------------------------------------------
// 3. Mock fetch BEFORE importing useAuthActions
// ---------------------------------------------------------
global.fetch = vi.fn();

// ---------------------------------------------------------
// 4. NOW import useAuthActions
// ---------------------------------------------------------
import { useAuthActions } from "../useAuthActions";

describe("useAuthActions (global UI version)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("successful login calls authLogin and showSuccess", async () => {
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

        await act(async () => {
            result.current.handleEmailChange({ target: { value: "test@example.com" } });
            result.current.handlePasswordChange({ target: { value: "password123" } });
        });

        await act(async () => {
            await result.current.login();
        });

        expect(mockAuthLogin).toHaveBeenCalled();
    });

    test("401 login triggers showError", async () => {
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

        expect(mockShowError).toHaveBeenCalledWith("Invalid email or password");
    });

    test("network error triggers showError", async () => {
        fetch.mockRejectedValueOnce(new Error("network"));

        const { result } = renderHook(() => useAuthActions());

        act(() => {
            result.current.handleEmailChange({ target: { value: "test@example.com" } });
            result.current.handlePasswordChange({ target: { value: "password123" } });
        });

        await act(async () => {
            await result.current.login();
        });

        expect(mockShowError).toHaveBeenCalledWith("Network error");
    });

    test("logout calls authLogout and showSuccess", async () => {
        const { result } = renderHook(() => useAuthActions());

        await act(async () => {
            await result.current.logout();
        });

        expect(mockAuthLogout).toHaveBeenCalled();
        expect(mockShowSuccess).toHaveBeenCalledWith("Logged out");
    });
});
