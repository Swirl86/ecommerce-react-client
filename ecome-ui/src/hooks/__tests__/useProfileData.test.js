import { renderHook } from "@testing-library/react";
import { vi } from "vitest";

// Mock AuthContext
let mockAccessToken = "abc123";

vi.mock("@context/AuthContext", () => ({
    useAuth: () => ({
        accessToken: mockAccessToken,
    }),
}));

// Mock getFullProfile
const mockGetFullProfile = vi.fn();
vi.mock("@api/profileApi", () => ({
    getFullProfile: (...args) => mockGetFullProfile(...args),
}));

// Mock API_BASE_URL
vi.mock("@config/api", () => ({
    API_BASE_URL: "http://mock-api",
}));

// Mock useCachedFetch
const mockUseCachedFetch = vi.fn();
vi.mock("@hooks/system/useCachedFetch", () => ({
    useCachedFetch: (...args) => mockUseCachedFetch(...args),
}));

import { useProfileData } from "../profile/useProfileData";

describe("useProfileData", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAccessToken = "abc123";
    });

    test("calls useCachedFetch with correct URL and fetcher", () => {
        mockUseCachedFetch.mockReturnValue({
            data: null,
            loading: false,
            error: null,
            refetch: vi.fn(),
        });

        renderHook(() => useProfileData());

        expect(mockUseCachedFetch).toHaveBeenCalledWith(
            "http://mock-api/users/me/full-profile",
            expect.objectContaining({
                fetcher: expect.any(Function),
                enabled: true,
            })
        );
    });

    test("fetcher calls getFullProfile with accessToken", async () => {
        const fetcher = vi.fn(() => "OK");

        mockUseCachedFetch.mockReturnValue({
            data: null,
            loading: false,
            error: null,
            refetch: vi.fn(),
        });

        renderHook(() => useProfileData());

        const args = mockUseCachedFetch.mock.calls[0][1];
        await args.fetcher();

        expect(mockGetFullProfile).toHaveBeenCalledWith("abc123");
    });

    test("returns data from useCachedFetch", () => {
        mockUseCachedFetch.mockReturnValue({
            data: { name: "Test" },
            loading: false,
            error: null,
            refetch: vi.fn(),
        });

        const { result } = renderHook(() => useProfileData());

        expect(result.current.data).toEqual({ name: "Test" });
    });

    test("does not fetch when no accessToken", () => {
        mockAccessToken = null;

        mockUseCachedFetch.mockReturnValue({
            data: null,
            loading: false,
            error: null,
            refetch: vi.fn(),
        });

        renderHook(() => useProfileData());

        const args = mockUseCachedFetch.mock.calls[0][1];
        expect(args.enabled).toBe(false);
    });
});
