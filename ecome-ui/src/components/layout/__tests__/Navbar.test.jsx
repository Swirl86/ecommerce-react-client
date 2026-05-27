import { act, render, screen } from "@testing-library/react";
import { createMockAuthForProviders, createMockUI } from "@utils/test-utils/mockUtils";
import { TestProviders } from "@utils/test-utils/TestProviders";
import { vi } from "vitest";

// ----------------------
// Mock useCart
// ----------------------
const mockUseCart = vi.fn();

// ----------------------
// Mock UIContext
// ----------------------
const mockUI = createMockUI();

vi.mock("@context/UIContext", async () => {
    const actual = await vi.importActual("@context/UIContext");
    return {
        ...actual, // keep UIContext + UIProvider
        useUI: () => mockUI, // override only the hook
    };
});

// ----------------------
// Mock AuthContext (Provider-safe)
// Keeps AuthContext + AuthProvider but overrides useAuth
// ----------------------
vi.mock("@context/AuthContext", async () => {
    const actual = await vi.importActual("@context/AuthContext");
    const authMock = createMockAuthForProviders();
    return {
        ...actual,
        useAuth: authMock.useAuth,
    };
});

// ----------------------
// Mock useCart hook
// ----------------------
vi.mock("@hooks/cart/useCart", () => ({
    useCart: () => mockUseCart(),
}));

// ----------------------
// Import Navbar AFTER mocks
// ----------------------
import Navbar from "../Navbar";

// ----------------------
// Tests
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
        // Initial render with empty cart
        mockUseCart.mockReturnValue({
            cart: [],
            version: 0,
        });

        const { rerender } = render(
            <TestProviders>
                <Navbar />
            </TestProviders>
        );

        expect(screen.queryByTestId("cart-badge")).toBeNull();

        // Update cart
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
