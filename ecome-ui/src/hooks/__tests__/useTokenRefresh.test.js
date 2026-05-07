import { SESSION_DURATION } from "@config/constants";
import { useTokenRefresh } from "@hooks/system/useTokenRefresh";
import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";

vi.useFakeTimers();

describe("useTokenRefresh", () => {
    test("refresh called on mount", async () => {
        const refresh = vi.fn();
        const setAuthLoading = vi.fn();

        renderHook(() => useTokenRefresh("refreshToken", refresh, setAuthLoading));

        // Flush microtasks (async useEffect)
        await act(() => {});

        expect(refresh).toHaveBeenCalled();
        expect(setAuthLoading).toHaveBeenCalledWith(false);
    });

    test("auto refresh interval", () => {
        const refresh = vi.fn();
        const setAuthLoading = vi.fn();

        renderHook(() => useTokenRefresh("refreshToken", refresh, setAuthLoading));

        vi.advanceTimersByTime(SESSION_DURATION);

        expect(refresh).toHaveBeenCalledTimes(2);
    });
});
