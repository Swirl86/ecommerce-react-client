import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";

import { useBackendMonitor } from "@hooks/system/backend-monitor/useBackendMonitor";

// Mock sub-hooks
vi.mock("@hooks/system/backend-monitor/useHealthcheck", () => ({
    useHealthcheck: () => vi.fn().mockResolvedValue(true),
}));

vi.mock("@hooks/system/backend-monitor/usePolling", () => ({
    usePolling: vi.fn(),
}));

vi.mock("@hooks/system/backend-monitor/useOfflineDuration", () => ({
    useOfflineDuration: vi.fn().mockReturnValue(1234),
}));

vi.mock("@hooks/system/backend-monitor/useBackendMonitorStateMachine", () => ({
    useBackendMonitorStateMachine: vi.fn().mockReturnValue({
        online: true,
        offlineSince: null,
        restoredAt: null,
        offlineMode: false,
        backoff: 1000,
    }),
}));

describe("useBackendMonitor (composition test)", () => {
    it("returns combined backend status", async () => {
        const { result } = renderHook(() => useBackendMonitor());

        await waitFor(() => {
            expect(result.current.checking).toBe(false);
        });

        expect(result.current).toEqual({
            online: true,
            offlineSince: null,
            restoredAt: null,
            offlineMode: false,
            backoff: 1000,
            offlineDuration: 1234,
            checking: false,
        });
    });
});
