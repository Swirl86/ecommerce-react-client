import { act, renderHook } from "@testing-library/react";
import { vi } from "vitest";

// ----------------------
// ACCESS TOKEN MOCK
// ----------------------
let mockAccessToken = "token123";

vi.mock("@context/AuthContext", () => ({
    useAuth: () => ({
        accessToken: mockAccessToken,
    }),
}));

// ----------------------
// useCachedFetch MOCK
// ----------------------
const mockRefetch = vi.fn();
const mockUseCachedFetch = vi.fn();

vi.mock("@hooks/system/useCachedFetch", () => ({
    useCachedFetch: (...args) => mockUseCachedFetch(...args),
}));

// ----------------------
// ADAPTER MOCKS
// ----------------------
const mockLocalGet = vi.fn();
const mockLocalAdd = vi.fn();
const mockLocalUpdate = vi.fn();
const mockLocalDelete = vi.fn();
const mockLocalClear = vi.fn();

const mockBackendGet = vi.fn();
const mockBackendAdd = vi.fn();
const mockBackendUpdate = vi.fn();
const mockBackendDelete = vi.fn();
const mockBackendClear = vi.fn();

vi.mock("@hooks/cart/cartAdapter", () => ({
    localAdapter: {
        get: (...args) => mockLocalGet(...args),
        add: (...args) => mockLocalAdd(...args),
        update: (...args) => mockLocalUpdate(...args),
        delete: (...args) => mockLocalDelete(...args),
        clear: (...args) => mockLocalClear(...args),
    },
    backendAdapter: vi.fn(() => ({
        get: (...args) => mockBackendGet(...args),
        add: (...args) => mockBackendAdd(...args),
        update: (...args) => mockBackendUpdate(...args),
        delete: (...args) => mockBackendDelete(...args),
        clear: (...args) => mockBackendClear(...args),
    })),
}));

// ----------------------
// IMPORT AFTER MOCKS
// ----------------------
import { useCartInternal } from "@hooks/cart/useCartInternal";

// ----------------------
// TESTS
// ----------------------
describe("useCartInternal", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockAccessToken = "token123";
    });

    // ---------------------------------------------------------
    // 1. INITIAL STATE (LOGGED OUT)
    // ---------------------------------------------------------
    test("returns empty cart when logged out", () => {
        mockAccessToken = null;

        mockUseCachedFetch.mockReturnValue({
            data: { items: [] },
            loading: false,
            error: null,
            refetch: mockRefetch,
        });

        mockLocalGet.mockReturnValue({ items: [] });

        const { result } = renderHook(() => useCartInternal());

        expect(result.current.cart).toEqual([]);
        expect(result.current.loading).toBe(false);
    });

    // ---------------------------------------------------------
    // 2. ADD ITEM (LOCAL MODE)
    // ---------------------------------------------------------
    test("addItem calls localAdapter.add and increments version", async () => {
        mockAccessToken = null;

        mockUseCachedFetch.mockReturnValue({
            data: { items: [] },
            loading: false,
            error: null,
            refetch: mockRefetch,
        });

        mockLocalGet.mockReturnValue({ items: [] });

        const { result } = renderHook(() => useCartInternal());

        await act(async () => {
            await result.current.addItem({ id: 1, name: "Phone" }, 2);
        });

        expect(mockLocalAdd).toHaveBeenCalledWith({ id: 1, name: "Phone" }, 2);
        expect(mockRefetch).toHaveBeenCalled();
        expect(result.current.version).toBe(1);
    });

    // ---------------------------------------------------------
    // 3. UPDATE ITEM (LOCAL MODE)
    // ---------------------------------------------------------
    test("updateQuantity calls localAdapter.update", async () => {
        mockAccessToken = null;

        mockUseCachedFetch.mockReturnValue({
            data: { items: [{ id: "abc", quantity: 1 }] },
            loading: false,
            error: null,
            refetch: mockRefetch,
        });

        mockLocalGet.mockReturnValue({ items: [{ id: "abc", quantity: 1 }] });

        const { result } = renderHook(() => useCartInternal());

        await act(async () => {
            await result.current.updateQuantity("abc", 5);
        });

        expect(mockLocalUpdate).toHaveBeenCalledWith("abc", 5);
        expect(mockRefetch).toHaveBeenCalled();
        expect(result.current.version).toBe(1);
    });

    // ---------------------------------------------------------
    // 4. DELETE ITEM (LOCAL MODE)
    // ---------------------------------------------------------
    test("deleteItem calls localAdapter.delete", async () => {
        mockAccessToken = null;

        mockUseCachedFetch.mockReturnValue({
            data: { items: [{ id: "abc" }] },
            loading: false,
            error: null,
            refetch: mockRefetch,
        });

        mockLocalGet.mockReturnValue({ items: [{ id: "abc" }] });

        const { result } = renderHook(() => useCartInternal());

        await act(async () => {
            await result.current.deleteItem("abc");
        });

        expect(mockLocalDelete).toHaveBeenCalledWith("abc");
        expect(mockRefetch).toHaveBeenCalled();
        expect(result.current.version).toBe(1);
    });

    // ---------------------------------------------------------
    // 5. CLEAR CART (LOCAL MODE)
    // ---------------------------------------------------------
    test("clear calls localAdapter.clear", async () => {
        mockAccessToken = null;

        mockUseCachedFetch.mockReturnValue({
            data: { items: [{ id: "abc" }] },
            loading: false,
            error: null,
            refetch: mockRefetch,
        });

        mockLocalGet.mockReturnValue({ items: [{ id: "abc" }] });

        const { result } = renderHook(() => useCartInternal());

        await act(async () => {
            await result.current.clear();
        });

        expect(mockLocalClear).toHaveBeenCalled();
        expect(mockRefetch).toHaveBeenCalled();
        expect(result.current.version).toBe(1);
    });

    // ---------------------------------------------------------
    // 6. BACKEND MODE (LOGGED IN)
    // ---------------------------------------------------------
    test("uses backendAdapter when logged in", () => {
        mockAccessToken = "token123";

        mockUseCachedFetch.mockReturnValue({
            data: { items: [] },
            loading: false,
            error: null,
            refetch: mockRefetch,
        });

        mockBackendGet.mockReturnValue({ items: [] });

        const { result } = renderHook(() => useCartInternal());

        expect(result.current.cart).toEqual([]);
        expect(result.current.loading).toBe(false);
    });
});
