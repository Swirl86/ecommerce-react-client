import { act, renderHook } from "@testing-library/react";
import { createDynamicAuthMock, createMockUI } from "@utils/test-utils/mockUtils";
import { vi } from "vitest";

// ---------------------------------------------------------
// AuthContext mock
// ---------------------------------------------------------
let mockAccessToken = "token123";

vi.mock("@context/AuthContext", () => createDynamicAuthMock(() => mockAccessToken));

// ---------------------------------------------------------
// UIContext mock
// ---------------------------------------------------------
const mockUI = createMockUI();

vi.mock("@context/UIContext", () => ({
    useUI: () => mockUI,
}));

// ---------------------------------------------------------
// Wishlist API mocks
// ---------------------------------------------------------
const mockGetWishlist = vi.fn();
const mockAddToWishlist = vi.fn();
const mockRemoveFromWishlist = vi.fn();
const mockClearWishlist = vi.fn();

vi.mock("@api/wishlistApi", () => ({
    getWishlist: (...args) => mockGetWishlist(...args),
    addToWishlist: (...args) => mockAddToWishlist(...args),
    removeFromWishlist: (...args) => mockRemoveFromWishlist(...args),
    clearWishlist: (...args) => mockClearWishlist(...args),
}));

// ---------------------------------------------------------
// useCachedFetch mock
// ---------------------------------------------------------
const mockUseCachedFetch = vi.fn();

vi.mock("@hooks/system/useCachedFetch", () => ({
    useCachedFetch: (...args) => mockUseCachedFetch(...args),
}));

// ---------------------------------------------------------
// Import hook AFTER mocks
// ---------------------------------------------------------
import { useWishlist } from "@hooks/profile/useWishlist";

// ---------------------------------------------------------
// Tests
// ---------------------------------------------------------
describe("useWishlist", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAccessToken = "token123";
    });

    test("returns safe defaults when no accessToken", () => {
        mockAccessToken = null;

        const { result } = renderHook(() => useWishlist());

        expect(result.current.wishlist).toEqual([]);
        expect(result.current.loading).toBe(true);
        expect(typeof result.current.toggle).toBe("function");
        expect(typeof result.current.clearAll).toBe("function");
    });

    test("fetches wishlist when logged in", () => {
        mockUseCachedFetch.mockReturnValue({
            data: [{ productId: 1 }],
            loading: false,
            refetch: vi.fn(),
        });

        const { result } = renderHook(() => useWishlist());

        expect(mockUseCachedFetch).toHaveBeenCalledWith(
            "/wishlist",
            expect.objectContaining({
                fetcher: expect.any(Function),
                token: "token123",
                disableGlobalLoading: true,
            })
        );

        expect(result.current.wishlist).toEqual([{ productId: 1 }]);
        expect(result.current.loading).toBe(false);
    });

    test("toggle adds item when not existing", async () => {
        const mockRefetch = vi.fn();

        mockUseCachedFetch.mockReturnValue({
            data: [],
            loading: false,
            refetch: mockRefetch,
        });

        const { result } = renderHook(() => useWishlist());

        await act(async () => {
            await result.current.toggle(5);
        });

        expect(mockAddToWishlist).toHaveBeenCalledWith(5, "token123");
        expect(mockRefetch).toHaveBeenCalled();
    });

    test("toggle removes item when existing", async () => {
        const mockRefetch = vi.fn();

        mockUseCachedFetch.mockReturnValue({
            data: [{ productId: 5 }],
            loading: false,
            refetch: mockRefetch,
        });

        const { result } = renderHook(() => useWishlist());

        await act(async () => {
            await result.current.toggle(5);
        });

        expect(mockRemoveFromWishlist).toHaveBeenCalledWith(5, "token123");
        expect(mockRefetch).toHaveBeenCalled();
    });

    test("clearAll calls API and refetch", async () => {
        const mockRefetch = vi.fn();

        mockUseCachedFetch.mockReturnValue({
            data: [{ productId: 1 }],
            loading: false,
            refetch: mockRefetch,
        });

        const { result } = renderHook(() => useWishlist());

        await act(async () => {
            await result.current.clearAll();
        });

        expect(mockClearWishlist).toHaveBeenCalledWith("token123");
        expect(mockRefetch).toHaveBeenCalled();
    });

    test("toggle handles errors", async () => {
        mockAddToWishlist.mockRejectedValueOnce(new Error("fail"));

        mockUseCachedFetch.mockReturnValue({
            data: [],
            loading: false,
            refetch: vi.fn(),
        });

        const { result } = renderHook(() => useWishlist());

        await act(async () => {
            await result.current.toggle(1);
        });

        expect(mockUI.showError).toHaveBeenCalledWith("fail");
    });

    test("clearAll handles errors", async () => {
        mockClearWishlist.mockRejectedValueOnce(new Error("boom"));

        mockUseCachedFetch.mockReturnValue({
            data: [],
            loading: false,
            refetch: vi.fn(),
        });

        const { result } = renderHook(() => useWishlist());

        await act(async () => {
            await result.current.clearAll();
        });

        expect(mockUI.showError).toHaveBeenCalledWith("boom");
    });
});
