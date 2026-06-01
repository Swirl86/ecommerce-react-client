import { useTokenRefresh } from "@hooks/system/useTokenRefresh";
import { act, renderHook } from "@testing-library/react";
import { createMockJwt } from "@utils/test-utils/mockUtils";
import { vi } from "vitest";

vi.useFakeTimers();

describe("useTokenRefresh", () => {
    test("refresh called on mount", async () => {
        const refresh = vi.fn();
        const setAuthLoading = vi.fn();

        const accessToken = createMockJwt(5000); // expires in 5s
        const refreshToken = "dummy";

        renderHook(() => useTokenRefresh(accessToken, refreshToken, refresh, setAuthLoading));

        await act(() => {});

        expect(refresh).not.toHaveBeenCalled(); // no immediate refresh
        expect(setAuthLoading).toHaveBeenCalledWith(false);
    });

    test("auto refresh before expiry", () => {
        const refresh = vi.fn();
        const setAuthLoading = vi.fn();

        const accessToken = createMockJwt(5000); // expires in 5s
        const refreshToken = "dummy";

        renderHook(() => useTokenRefresh(accessToken, refreshToken, refresh, setAuthLoading));

        // REFRESH_OFFSET_MS = 60s → but expiry is only 5s → refresh happens immediately
        act(() => {
            vi.runAllTimers();
        });

        expect(refresh).toHaveBeenCalledTimes(1);
    });
});
