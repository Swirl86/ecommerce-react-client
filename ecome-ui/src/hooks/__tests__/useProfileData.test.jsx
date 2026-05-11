import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";

// Mock UIContext
const mockSetLoading = vi.fn();
const mockShowError = vi.fn();

vi.mock("@context/UIContext", () => ({
    useUI: () => ({
        setLoading: mockSetLoading,
        showError: mockShowError,
    }),
}));

// Mock AuthContext
let mockAccessToken = "abc123";

vi.mock("@context/AuthContext", () => ({
    useAuth: () => ({
        accessToken: mockAccessToken,
    }),
}));

// Mock API_BASE_URL
vi.mock("@config/api", () => ({
    API_BASE_URL: "http://mock-api",
}));

// Mock fetch
global.fetch = vi.fn();

import { useProfileData } from "../profile/useProfileData";

describe("useProfileData", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAccessToken = "abc123";
    });

    test("fetches profile data successfully", async () => {
        const mockResponse = {
            name: "Test User",
            email: "test@example.com",
        };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const { result } = renderHook(() => useProfileData());

        // Wait for useEffect + fetch to resolve
        await act(async () => {});

        expect(fetch).toHaveBeenCalledWith(
            "http://mock-api/users/me/full-profile",
            expect.objectContaining({
                headers: { Authorization: "Bearer abc123" },
            })
        );

        expect(mockSetLoading).toHaveBeenCalledWith(true);
        expect(mockSetLoading).toHaveBeenCalledWith(false);

        expect(result.current.data).toEqual(mockResponse);
    });

    test("shows error when response is not ok", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
        });

        const { result } = renderHook(() => useProfileData());

        await act(async () => {});

        expect(mockShowError).toHaveBeenCalledWith("Could not load profile");
        expect(result.current.data).toBe(null);
    });

    test("shows error on network failure", async () => {
        fetch.mockRejectedValueOnce(new Error("Network error"));

        const { result } = renderHook(() => useProfileData());

        await act(async () => {});

        expect(mockShowError).toHaveBeenCalledWith("Network error while loading profile");
        expect(result.current.data).toBe(null);
    });

    test("does nothing if no accessToken", async () => {
        mockAccessToken = null;

        const { result } = renderHook(() => useProfileData());

        await act(async () => {});

        expect(fetch).not.toHaveBeenCalled();
        expect(result.current.data).toBe(null);
    });
});
