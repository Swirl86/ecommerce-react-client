import { LOCAL_AUTH_KEY } from "@config/constants";
import { useAuthStorage } from "@hooks/auth/useAuthStorage";
import { renderHook } from "@testing-library/react";

describe("useAuthStorage", () => {
    beforeEach(() => {
        localStorage.clear();
        sessionStorage.clear();
    });

    test("loads from localStorage when remember=true", () => {
        const stored = {
            accessToken: "abc",
            refreshToken: "r1",
            user: { id: 1 },
            remember: true,
        };

        localStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(stored));

        const { result } = renderHook(() => useAuthStorage());
        const data = result.current.load();

        expect(data.accessToken).toBe("abc");
        expect(data.remember).toBe(true);
        expect(data.user.id).toBe(1);
    });

    test("loads from sessionStorage when remember=false", () => {
        const stored = {
            accessToken: "xyz",
            refreshToken: "r2",
            user: { id: 2 },
            remember: false,
        };

        sessionStorage.setItem(LOCAL_AUTH_KEY, JSON.stringify(stored));

        const { result } = renderHook(() => useAuthStorage());
        const data = result.current.load();

        expect(data.accessToken).toBe("xyz");
        expect(data.remember).toBe(false);
        expect(data.user.id).toBe(2);
    });

    test("save stores correctly in localStorage when remember=true", () => {
        const { result } = renderHook(() => useAuthStorage());

        result.current.save(
            {
                accessToken: "abc",
                refreshToken: "xyz",
                user: { id: 1 },
            },
            true
        );

        const stored = JSON.parse(localStorage.getItem(LOCAL_AUTH_KEY));

        expect(stored.accessToken).toBe("abc");
        expect(stored.refreshToken).toBe("xyz");
        expect(stored.user.id).toBe(1);
        expect(stored.remember).toBe(true);

        expect(sessionStorage.getItem(LOCAL_AUTH_KEY)).toBe(null);
    });

    test("save stores correctly in sessionStorage when remember=false", () => {
        const { result } = renderHook(() => useAuthStorage());

        result.current.save(
            {
                accessToken: "aaa",
                refreshToken: "bbb",
                user: { id: 3 },
            },
            false
        );

        const stored = JSON.parse(sessionStorage.getItem(LOCAL_AUTH_KEY));

        expect(stored.accessToken).toBe("aaa");
        expect(stored.refreshToken).toBe("bbb");
        expect(stored.user.id).toBe(3);
        expect(stored.remember).toBe(false);

        expect(localStorage.getItem(LOCAL_AUTH_KEY)).toBe(null);
    });

    test("clear removes all auth data", () => {
        localStorage.setItem(LOCAL_AUTH_KEY, "1");
        sessionStorage.setItem(LOCAL_AUTH_KEY, "1");

        const { result } = renderHook(() => useAuthStorage());
        result.current.clear();

        expect(localStorage.getItem(LOCAL_AUTH_KEY)).toBe(null);
        expect(sessionStorage.getItem(LOCAL_AUTH_KEY)).toBe(null);
    });
});
