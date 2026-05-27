import {
    createMockApiBaseUrl,
    createMockEtagCache,
    createMockFetch,
} from "@utils/test-utils/mockUtils";
import { vi } from "vitest";
import { apiGet, apiSend } from "../apiClient";

// ----------------------
// Mocks
// ----------------------
// Placeholder references (assigned AFTER mocks)
let apiBaseUrl;
let etagCache;

// Mock @config/api
vi.mock("@config/api", () => ({
    get API_BASE_URL() {
        return apiBaseUrl.get();
    },
}));

// Mock @utils/etagCache (via @utils index re-export)
vi.mock("@utils/etagCache", () => ({
    getCached: (...args) => etagCache.mockGetCached(...args),
    saveCached: (...args) => etagCache.mockSaveCached(...args),
}));

// Mock @utils (because it re-exports etagCache)
vi.mock("@utils", () => ({
    getCached: (...args) => etagCache.mockGetCached(...args),
    saveCached: (...args) => etagCache.mockSaveCached(...args),
}));

// Mock fetch
const mockFetch = createMockFetch();

// ---------------------------------------------------------
// Initialize mocks AFTER vi.mock()
// ---------------------------------------------------------
apiBaseUrl = createMockApiBaseUrl();
etagCache = createMockEtagCache();

// ---------------------------------------------------------
// TESTS
// ---------------------------------------------------------
describe("apiClient", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("GET without cache", async () => {
        etagCache.mockGetCached.mockReturnValue(null);

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ ok: true }),
            headers: { get: () => null },
        });

        const result = await apiGet("/test");

        expect(mockFetch).toHaveBeenCalledWith("http://mock-api/test", {
            headers: {},
        });

        expect(result).toEqual({ ok: true });
    });

    test("GET with cache + 304 returns cached data", async () => {
        etagCache.mockGetCached.mockReturnValue({
            etag: "abc",
            data: { cached: true },
        });

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 304,
            headers: { get: () => null },
        });

        const result = await apiGet("/test");

        expect(result).toEqual({ cached: true });
    });

    test("GET updates cache when ETag present", async () => {
        etagCache.mockGetCached.mockReturnValue(null);

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ fresh: true }),
            headers: { get: () => "etag123" },
        });

        await apiGet("/test");

        expect(etagCache.mockSaveCached).toHaveBeenCalledWith(
            "http://mock-api/test",
            { fresh: true },
            "etag123"
        );
    });

    test("GET sends Authorization header when token exists", async () => {
        etagCache.mockGetCached.mockReturnValue(null);

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve({}),
            headers: { get: () => null },
        });

        await apiGet("/test", "token123");

        expect(mockFetch).toHaveBeenCalledWith("http://mock-api/test", {
            headers: { Authorization: "Bearer token123" },
        });
    });

    test("GET throws error when !res.ok", async () => {
        etagCache.mockGetCached.mockReturnValue(null);

        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        await expect(apiGet("/test")).rejects.toThrow("API error: 500");
    });

    test("apiSend sends correct method, body and headers", async () => {
        mockFetch.mockResolvedValueOnce({ ok: true });

        await apiSend("POST", "/test", { a: 1 });

        expect(mockFetch).toHaveBeenCalledWith("http://mock-api/test", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ a: 1 }),
        });
    });

    test("apiSend includes Authorization header when token exists", async () => {
        mockFetch.mockResolvedValueOnce({ ok: true });

        await apiSend("PUT", "/test", { a: 1 }, "token123");

        expect(mockFetch).toHaveBeenCalledWith("http://mock-api/test", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer token123",
            },
            body: JSON.stringify({ a: 1 }),
        });
    });
});
