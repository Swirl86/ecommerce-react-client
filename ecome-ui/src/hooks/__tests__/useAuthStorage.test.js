import { useAuthStorage } from "@hooks/auth/useAuthStorage";
import { renderHook } from "@testing-library/react";

describe("useAuthStorage", () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    test("loads from localStorage when remember=true", () => {
        localStorage.setItem("remember", "true");
        localStorage.setItem("accessToken", "abc");

        const { result } = renderHook(() => useAuthStorage());
        const data = result.current.load();

        expect(data.accessToken).toBe("abc");
        expect(data.remember).toBe(true);
    });

    test("loads from sessionStorage when remember=false", () => {
        sessionStorage.setItem("accessToken", "xyz");

        const { result } = renderHook(() => useAuthStorage());
        const data = result.current.load();

        expect(data.accessToken).toBe("xyz");
        expect(data.remember).toBe(false);
    });

    test("save stores correctly", () => {
        const { result } = renderHook(() => useAuthStorage());

        result.current.save(
            {
                accessToken: "abc",
                refreshToken: "xyz",
                user: { id: 1 },
            },
            true
        );

        expect(localStorage.getItem("accessToken")).toBe("abc");
        expect(sessionStorage.getItem("accessToken")).toBe(null);
    });

    test("clear removes all", () => {
        localStorage.setItem("test", "1");
        sessionStorage.setItem("test", "1");

        const { result } = renderHook(() => useAuthStorage());
        result.current.clear();

        expect(localStorage.length).toBe(0);
        expect(sessionStorage.length).toBe(0);
    });
});
