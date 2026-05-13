import { useBackendMonitorStateMachine } from "@hooks/system/backend-monitor/useBackendMonitorStateMachine";
import { renderHook } from "@testing-library/react";

describe("useBackendMonitorStateMachine", () => {
    it("handles online → offline transition", () => {
        const { result, rerender } = renderHook(
            ({ ok, duration }) => useBackendMonitorStateMachine(ok, duration),
            { initialProps: { ok: true, duration: 0 } }
        );

        rerender({ ok: false, duration: 0 });

        expect(result.current.online).toBe(false);
        expect(result.current.offlineSince).not.toBe(null);
    });

    it("handles offline → online transition", () => {
        const { result, rerender } = renderHook(
            ({ ok, duration }) => useBackendMonitorStateMachine(ok, duration),
            { initialProps: { ok: false, duration: 0 } }
        );

        rerender({ ok: true, duration: 0 });

        expect(result.current.online).toBe(true);
        expect(result.current.restoredAt).not.toBe(null);
    });

    it("sets offlineMode when duration exceeds threshold", () => {
        const { result } = renderHook(() => useBackendMonitorStateMachine(false, 999999));

        expect(result.current.offlineMode).toBe(true);
    });
});
