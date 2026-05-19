import { vi } from "vitest";
import { apiGet, apiSend } from "../apiClient";

// ----------------------
// MOCKS
// ----------------------
let mockBaseUrl = "http://mock-api";

vi.mock("@config/api", () => ({
    get API_BASE_URL() {
        return mockBaseUrl;
    },
}));

const mockGetCached = vi.fn();
const mockSaveCached = vi.fn();

vi.mock("@utils/etagCache", () => ({
    getCached: (...args) => mockGetCached(...args),
    saveCached: (...args) => mockSaveCached(...args),
}));

// Mock global fetch
global.fetch = vi.fn();

describe("apiClient", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    // ----------------------
    // apiGet
    // ----------------------
    test("GET without cache", async () => {
        mockGetCached.mockReturnValue(null);

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ ok: true }),
            headers: { get: () => null },
        });

        const result = await apiGet("/test");

        expect(fetch).toHaveBeenCalledWith("http://mock-api/test", {
            headers: {},
        });

        expect(result).toEqual({ ok: true });
    });

    test("GET with cache + 304 returns cached data", async () => {
        mockGetCached.mockReturnValue({
            etag: "abc",
            data: { cached: true },
        });

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 304,
            headers: { get: () => null },
        });

        const result = await apiGet("/test");

        expect(result).toEqual({ cached: true });
    });

    test("GET updates cache when ETag present", async () => {
        mockGetCached.mockReturnValue(null);

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve({ fresh: true }),
            headers: { get: () => "etag123" },
        });

        await apiGet("/test");

        expect(mockSaveCached).toHaveBeenCalledWith(
            "http://mock-api/test",
            { fresh: true },
            "etag123"
        );
    });

    test("GET sends Authorization header when token exists", async () => {
        mockGetCached.mockReturnValue(null);

        fetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve({}),
            headers: { get: () => null },
        });

        await apiGet("/test", "token123");

        expect(fetch).toHaveBeenCalledWith("http://mock-api/test", {
            headers: { Authorization: "Bearer token123" },
        });
    });

    test("GET throws error when !res.ok", async () => {
        mockGetCached.mockReturnValue(null);

        fetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
        });

        await expect(apiGet("/test")).rejects.toThrow("API error: 500");
    });

    // ----------------------
    // apiSend
    // ----------------------
    test("apiSend sends correct method, body and headers", async () => {
        fetch.mockResolvedValueOnce({ ok: true });

        await apiSend("POST", "/test", { a: 1 });

        expect(fetch).toHaveBeenCalledWith("http://mock-api/test", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ a: 1 }),
        });
    });

    test("apiSend includes Authorization header when token exists", async () => {
        fetch.mockResolvedValueOnce({ ok: true });

        await apiSend("PUT", "/test", { a: 1 }, "token123");

        expect(fetch).toHaveBeenCalledWith("http://mock-api/test", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer token123",
            },
            body: JSON.stringify({ a: 1 }),
        });
    });
});
