import { SESSION_DURATION, WARNING_BEFORE } from "@config/constants";
import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";
import { useSessionTimers } from "../useSessionTimers";

vi.useFakeTimers();

describe("useSessionTimers", () => {
    const mockRefresh = vi.fn();
    const mockLogout = vi.fn();

    test("shows warning after timeout", () => {
        const { result } = renderHook(() =>
            useSessionTimers("refreshToken", false, mockRefresh, mockLogout)
        );

        act(() => {
            vi.advanceTimersByTime(SESSION_DURATION - WARNING_BEFORE);
        });

        expect(result.current.showSessionWarning).toBe(true);
    });

    test("countdown decreases", () => {
        const { result } = renderHook(() =>
            useSessionTimers("refreshToken", false, mockRefresh, mockLogout)
        );

        act(() => {
            vi.advanceTimersByTime(SESSION_DURATION - WARNING_BEFORE);
        });

        act(() => {
            vi.advanceTimersByTime(1000);
        });

        expect(result.current.countdown).toBe(Math.floor(WARNING_BEFORE / 1000) - 1);
    });

    test("logout when countdown hits zero", () => {
        const { result } = renderHook(() =>
            useSessionTimers("refreshToken", false, mockRefresh, mockLogout)
        );

        // 1) Trigger session warning
        act(() => {
            vi.advanceTimersByTime(SESSION_DURATION - WARNING_BEFORE);
        });

        // 2) Trigger countdown (WARNING_BEFORE ms)
        act(() => {
            vi.advanceTimersByTime(WARNING_BEFORE);
        });

        expect(mockLogout).toHaveBeenCalled();
    });

    test("extendSession resets timers", async () => {
        mockRefresh.mockResolvedValue(true);

        const { result } = renderHook(() =>
            useSessionTimers("refreshToken", false, mockRefresh, mockLogout)
        );

        act(() => {
            vi.advanceTimersByTime(SESSION_DURATION - WARNING_BEFORE);
        });

        expect(result.current.showSessionWarning).toBe(true);

        await act(async () => {
            await result.current.extendSession();
        });

        expect(result.current.showSessionWarning).toBe(false);
    });
});
