import { useHealthcheck } from "@hooks/system/backend-monitor/useHealthcheck";
import { renderHook } from "@testing-library/react";
import { vi } from "vitest";

describe("useHealthcheck", () => {
    it("returns true when fetch succeeds", async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: true });

        const { result } = renderHook(() => useHealthcheck());
        const ok = await result.current("/health");

        expect(ok).toBe(true);
    });

    it("returns false when fetch fails", async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: false });

        const { result } = renderHook(() => useHealthcheck());
        const ok = await result.current("/health");

        expect(ok).toBe(false);
    });

    it("returns false when fetch throws", async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error("network"));

        const { result } = renderHook(() => useHealthcheck());
        const ok = await result.current("/health");

        expect(ok).toBe(false);
    });
});
