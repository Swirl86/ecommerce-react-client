import { act, render, screen } from "@testing-library/react";
import { TestProviders } from "@utils/test-utils/TestProviders";
import { vi } from "vitest";

// ----------------------
// MOCK useCart
// ----------------------
const mockUseCart = vi.fn();

vi.mock("@hooks/cart/useCart", () => ({
    useCart: () => mockUseCart(),
}));

// ----------------------
// MOCK AuthContext
// ----------------------
vi.mock("@context/AuthContext", async () => {
    const actual = await vi.importActual("@context/AuthContext");
    return {
        ...actual,
        useAuth: () => ({
            isAuthenticated: true,
            user: { id: 1 },
        }),
    };
});

// ----------------------
// MOCK UIContext
// ----------------------
vi.mock("@context/UIContext", async () => {
    const actual = await vi.importActual("@context/UIContext");
    return {
        ...actual,
        useUI: () => ({
            showSuccess: vi.fn(),
            showError: vi.fn(),
            showInfo: vi.fn(),
        }),
    };
});

// ----------------------
// IMPORT Navbar AFTER mocks
// ----------------------
import Navbar from "../Navbar";

// ----------------------
// TESTS
// ----------------------
describe("Navbar cart badge", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("hides badge when cart is empty", () => {
        mockUseCart.mockReturnValue({
            cart: [],
            version: 0,
        });

        render(
            <TestProviders>
                <Navbar />
            </TestProviders>
        );

        expect(screen.queryByTestId("cart-badge")).toBeNull();
    });

    test("shows badge when cart has items", () => {
        mockUseCart.mockReturnValue({
            cart: [{ id: 1, quantity: 2 }],
            version: 0,
        });

        render(
            <TestProviders>
                <Navbar />
            </TestProviders>
        );

        const badges = screen.getAllByTestId("cart-badge");
        expect(badges[0]).toHaveTextContent("2");
    });

    test("updates badge when cart changes", () => {
        const { rerender } = render(
            <TestProviders>
                <Navbar />
            </TestProviders>
        );

        // First render: empty cart
        mockUseCart.mockReturnValue({
            cart: [],
            version: 0,
        });

        rerender(
            <TestProviders>
                <Navbar />
            </TestProviders>
        );

        expect(screen.queryByTestId("cart-badge")).toBeNull();

        // Second render: cart has items
        mockUseCart.mockReturnValue({
            cart: [
                { id: 1, quantity: 1 },
                { id: 2, quantity: 3 },
            ],
            version: 1,
        });

        act(() => {
            rerender(
                <TestProviders>
                    <Navbar />
                </TestProviders>
            );
        });

        const badges = screen.getAllByTestId("cart-badge");
        expect(badges[0]).toHaveTextContent("4");
    });
});
