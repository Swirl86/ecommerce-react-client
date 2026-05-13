import { useOfflineDuration } from "@hooks/system/backend-monitor/useOfflineDuration";
import { renderHook } from "@testing-library/react";
import { vi } from "vitest";

describe("useOfflineDuration", () => {
    it("returns 0 when offlineSince is null", () => {
        const { result } = renderHook(() => useOfflineDuration(null));
        expect(result.current).toBe(0);
    });

    it("computes correct duration when Date.now is mocked", () => {
        const start = 1000000;

        vi.spyOn(Date, "now").mockReturnValue(start + 2000);

        const { result } = renderHook(() => useOfflineDuration(start));

        expect(Date.now() - start).toBe(2000);
    });
});
