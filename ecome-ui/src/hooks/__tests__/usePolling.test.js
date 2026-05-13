import { usePolling } from "@hooks/system/backend-monitor/usePolling";
import { renderHook } from "@testing-library/react";
import { vi } from "vitest";

describe("usePolling", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    it("calls callback repeatedly", () => {
        const cb = vi.fn();

        renderHook(() => usePolling(cb, 1000, true));

        vi.advanceTimersByTime(3000);

        expect(cb).toHaveBeenCalledTimes(3);
    });

    it("stops polling when disabled", () => {
        const cb = vi.fn();

        const { rerender } = renderHook(({ enabled }) => usePolling(cb, 1000, enabled), {
            initialProps: { enabled: true },
        });

        vi.advanceTimersByTime(2000);
        expect(cb).toHaveBeenCalledTimes(2);

        rerender({ enabled: false });
        vi.advanceTimersByTime(2000);

        expect(cb).toHaveBeenCalledTimes(2);
    });
});
