import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";

const mockRegister = vi.fn();

vi.mock("@hooks/auth/useAuthActions", () => ({
    useAuthActions: () => ({
        register: mockRegister,
    }),
}));

import { useRegisterForm } from "../auth/useRegisterForm";

describe("useRegisterForm", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("updates email and validates", () => {
        const { result } = renderHook(() => useRegisterForm());

        act(() => {
            result.current.handleEmailChange({ target: { value: "bad" } });
        });

        expect(result.current.emailError).toBe("Email must contain @");
    });

    test("updates password and validates", () => {
        const { result } = renderHook(() => useRegisterForm());

        act(() => {
            result.current.handlePasswordChange({ target: { value: "123" } });
        });

        expect(result.current.passwordError).toBe("Password must be at least 8 characters");
    });

    test("handleSubmit calls register with correct payload", async () => {
        const { result } = renderHook(() => useRegisterForm());

        act(() => {
            result.current.handleEmailChange({ target: { value: "test@example.com" } });
            result.current.handlePasswordChange({ target: { value: "password123" } });
        });

        await act(async () => {
            await result.current.handleSubmit({ preventDefault: () => {} });
        });

        expect(mockRegister).toHaveBeenCalledWith({
            email: "test@example.com",
            password: "password123",
        });
    });
});
