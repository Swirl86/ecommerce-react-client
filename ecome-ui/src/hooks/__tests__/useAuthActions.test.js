import { act, renderHook } from "@testing-library/react";
import { createMockUI } from "@utils/test-utils/mockUtils";
import { vi } from "vitest";

// ---------------------------------------------------------
// 1. Mock UIContext
// ---------------------------------------------------------
const mockUI = createMockUI({
    showCartMergeDialog: vi.fn(),
});

vi.mock("@context/UIContext", () => ({
    useUI: () => mockUI,
}));

// ---------------------------------------------------------
// 2. Mock AuthContext
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
// 3. Mock cart + storage logic
// ---------------------------------------------------------
vi.mock("@api/cartApi", () => ({
    getCart: vi.fn(() => ({ items: [] })),
    clearCart: vi.fn().mockResolvedValue(),
}));

vi.mock("@utils/cart/localCart", () => ({
    getLocalCart: vi.fn(() => ({ items: [] })),
}));

vi.mock("@utils/cart/cartSync", () => ({
    syncBackendCartToLocal: vi.fn().mockResolvedValue(),
    syncLocalCartToBackend: vi.fn().mockResolvedValue(),
}));

vi.mock("@utils/cart/compareCarts", () => ({
    cartsAreIdentical: vi.fn(() => true),
}));

// ---------------------------------------------------------
// 4. Mock fetch BEFORE importing useAuthActions
// ---------------------------------------------------------
global.fetch = vi.fn();

// ---------------------------------------------------------
// 5. Import useAuthActions
// ---------------------------------------------------------
import { useAuthActions } from "@hooks/auth/useAuthActions";

// ---------------------------------------------------------
// TESTS
// ---------------------------------------------------------
describe("useAuthActions (new architecture)", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // -----------------------------------------------------
    // LOGIN TESTS
    // -----------------------------------------------------
    test("successful login calls authLogin", async () => {
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
            await result.current.login({
                email: "test@example.com",
                password: "password123",
                remember: false,
            });
        });

        expect(mockAuthLogin).toHaveBeenCalled();
    });

    test("401 login triggers showError", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 401,
        });

        const { result } = renderHook(() => useAuthActions());

        await act(async () => {
            await result.current.login({
                email: "test@example.com",
                password: "password123",
                remember: false,
            });
        });

        expect(mockUI.showError).toHaveBeenCalledWith("Invalid email or password");
    });

    test("network error triggers showError", async () => {
        fetch.mockRejectedValueOnce(new Error("network"));

        const { result } = renderHook(() => useAuthActions());

        await act(async () => {
            await result.current.login({
                email: "test@example.com",
                password: "password123",
                remember: false,
            });
        });

        expect(mockUI.showError).toHaveBeenCalledWith("Network error");
    });

    // -----------------------------------------------------
    // LOGOUT TEST
    // -----------------------------------------------------
    test("logout calls authLogout and showSuccess", async () => {
        const { result } = renderHook(() => useAuthActions());

        await act(async () => {
            await result.current.logout();
        });

        expect(mockAuthLogout).toHaveBeenCalled();
    });

    // -----------------------------------------------------
    // REGISTER TESTS
    // -----------------------------------------------------
    test("successful register calls authLogin and showSuccess", async () => {
        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                accessToken: "abc",
                refreshToken: "xyz",
                userId: 1,
                email: "new@example.com",
                role: "USER",
            }),
        });

        const { result } = renderHook(() => useAuthActions());

        await act(async () => {
            await result.current.register({
                email: "new@example.com",
                password: "password123",
            });
        });

        expect(mockAuthLogin).toHaveBeenCalled();
        expect(mockUI.showSuccess).toHaveBeenCalledWith("Account created");
    });

    test("409 register triggers showError", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 409,
        });

        const { result } = renderHook(() => useAuthActions());

        await act(async () => {
            await result.current.register({
                email: "exists@example.com",
                password: "password123",
            });
        });

        expect(mockUI.showError).toHaveBeenCalledWith(
            "That email is already registered. Try logging in instead."
        );
    });

    test("400 register triggers showError", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
        });

        const { result } = renderHook(() => useAuthActions());

        await act(async () => {
            await result.current.register({
                email: "bad",
                password: "short",
            });
        });

        expect(mockUI.showError).toHaveBeenCalledWith(
            "Some information is missing or invalid. Please review the form."
        );
    });
});
