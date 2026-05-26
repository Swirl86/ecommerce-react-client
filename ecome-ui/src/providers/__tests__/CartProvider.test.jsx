import { renderHook } from "@testing-library/react";
import { vi } from "vitest";

// ----------------------
// MOCK useCartInternal
// ----------------------
const mockUseCartInternal = vi.fn();

vi.mock("@hooks/cart/useCartInternal", () => ({
    useCartInternal: (...args) => mockUseCartInternal(...args),
}));

// ----------------------
// IMPORT AFTER MOCKS
// ----------------------
import { useCart } from "@hooks/cart/useCart";
import { CartProvider } from "@providers/CartProvider";

// ----------------------
// TESTS
// ----------------------
describe("CartProvider", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("provides value from useCartInternal to children", () => {
        const fakeValue = {
            cart: [{ id: 1 }],
            addItem: vi.fn(),
            updateQuantity: vi.fn(),
            deleteItem: vi.fn(),
            clear: vi.fn(),
            loading: false,
            error: null,
            refetch: vi.fn(),
            version: 7,
        };

        mockUseCartInternal.mockReturnValue(fakeValue);

        const { result } = renderHook(() => useCart(), {
            wrapper: ({ children }) => <CartProvider>{children}</CartProvider>,
        });

        expect(result.current).toEqual(fakeValue);
    });

    test("throws error when useCart is used outside provider", () => {
        expect(() => renderHook(() => useCart())).toThrow(
            "useCart must be used inside <CartProvider>"
        );
    });
});
