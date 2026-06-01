import { WARNING_BEFORE } from "@config/constants";
import { useSessionTimers } from "@hooks/system/useSessionTimers";
import { act, renderHook } from "@testing-library/react";
import { createMockJwt } from "@utils/test-utils/mockUtils";
import { vi } from "vitest";

vi.useFakeTimers();

describe("useSessionTimers", () => {
    const mockRefresh = vi.fn();
    const mockLogout = vi.fn();

    const EXPIRY = 10 * 60 * 1000; // 10 min

    test("shows warning before expiry", () => {
        const accessToken = createMockJwt(EXPIRY);

        const { result } = renderHook(() =>
            useSessionTimers(accessToken, false, mockRefresh, mockLogout)
        );

        act(() => {
            vi.advanceTimersByTime(EXPIRY - WARNING_BEFORE);
        });

        expect(result.current.showSessionWarning).toBe(true);
    });

    test("countdown decreases", () => {
        const accessToken = createMockJwt(EXPIRY);

        const { result } = renderHook(() =>
            useSessionTimers(accessToken, false, mockRefresh, mockLogout)
        );

        act(() => {
            vi.advanceTimersByTime(EXPIRY - WARNING_BEFORE);
        });

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(result.current.countdown).toBe(Math.floor(WARNING_BEFORE / 1000) - 1);
    });

    test("logout when countdown hits zero", () => {
        const accessToken = createMockJwt(EXPIRY);

        renderHook(() => useSessionTimers(accessToken, false, mockRefresh, mockLogout));

        act(() => {
            vi.advanceTimersByTime(EXPIRY);
        });

        expect(mockLogout).toHaveBeenCalled();
    });

    test("extendSession resets timers", async () => {
        mockRefresh.mockResolvedValue(true);

        const accessToken = createMockJwt(EXPIRY);

        const { result } = renderHook(() =>
            useSessionTimers(accessToken, false, mockRefresh, mockLogout)
        );

        act(() => {
            vi.advanceTimersByTime(EXPIRY - WARNING_BEFORE);
        });

        expect(result.current.showSessionWarning).toBe(true);

        await act(async () => {
            await result.current.extendSession();
        });

        expect(result.current.showSessionWarning).toBe(false);
    });
});
