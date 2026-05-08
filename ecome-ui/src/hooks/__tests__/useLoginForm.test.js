import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";

// ---------------------------------------------------------
// Mock useAuthActions.login()
// ---------------------------------------------------------
const mockLogin = vi.fn();

vi.mock("@hooks/auth/useAuthActions", () => ({
    useAuthActions: () => ({
        login: mockLogin,
    }),
}));

import { useLoginForm } from "@hooks/auth/useLoginForm";

describe("useLoginForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("updates email and validates", () => {
        const { result } = renderHook(() => useLoginForm());

        act(() => {
            result.current.handleEmailChange({ target: { value: "bad" } });
        });

        expect(result.current.email).toBe("bad");
        expect(result.current.emailError).toBe("Email must contain @");
    });

    test("updates password and validates", () => {
        const { result } = renderHook(() => useLoginForm());

        act(() => {
            result.current.handlePasswordChange({ target: { value: "123" } });
        });

        expect(result.current.password).toBe("123");
        expect(result.current.passwordError).toBe("Password must be at least 8 characters");
    });

    test("handleSubmit calls login with correct payload", async () => {
        const { result } = renderHook(() => useLoginForm());

        act(() => {
            result.current.handleEmailChange({ target: { value: "test@example.com" } });
            result.current.handlePasswordChange({ target: { value: "password123" } });
        });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: () => {} });
        });

        expect(mockLogin).toHaveBeenCalledWith({
            email: "test@example.com",
            password: "password123",
            remember: false,
        });
    });
});
