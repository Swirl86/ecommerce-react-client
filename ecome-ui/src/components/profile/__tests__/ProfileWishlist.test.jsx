import ProfileWishlist from "@components/profile/ProfileWishlist";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

// ----------------------
// MOCKS
// ----------------------
vi.mock("@hooks/profile/useWishlist", () => ({
    useWishlist: vi.fn(),
}));

vi.mock("@hooks/domain/useProducts", () => ({
    useProducts: vi.fn(),
}));

vi.mock("@products/ProductCard", () => ({
    default: () => <div data-testid="product-card" />,
}));

vi.mock("@ui/ConfirmDialog", () => ({
    default: ({ open, onConfirm, onCancel }) => {
        if (!open) return null;
        return (
            <div data-testid="confirm-dialog">
                <button onClick={onConfirm}>confirm-delete</button>
                <button onClick={onCancel}>cancel-delete</button>
            </div>
        );
    },
}));

vi.mock("@typography", () => ({
    H2: ({ children }) => <h2>{children}</h2>,
    Muted: ({ children }) => <span>{children}</span>,
}));

import { useProducts } from "@hooks/domain/useProducts";
import { useWishlist } from "@hooks/profile/useWishlist";

// ----------------------
// TESTS
// ----------------------
describe("ProfileWishlist", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renders empty state when no wishlist products", () => {
        vi.mocked(useWishlist).mockReturnValue({
            wishlist: [],
            clearAll: vi.fn(),
        });

        vi.mocked(useProducts).mockReturnValue({
            products: [],
            loading: false,
        });

        render(<ProfileWishlist />);

        expect(screen.getByText("Your wishlist is empty.")).toBeInTheDocument();
        expect(screen.queryByText("Clear all")).not.toBeInTheDocument();
    });

    test("renders wishlist products", () => {
        vi.mocked(useWishlist).mockReturnValue({
            wishlist: [{ productId: 1 }],
            clearAll: vi.fn(),
        });

        vi.mocked(useProducts).mockReturnValue({
            products: [{ id: 1, name: "Laptop" }],
            loading: false,
        });

        render(<ProfileWishlist />);

        expect(screen.getByTestId("product-card")).toBeInTheDocument();
        expect(screen.getByText("Clear all")).toBeInTheDocument();
    });

    test("opens confirm dialog when clicking Clear all", () => {
        vi.mocked(useWishlist).mockReturnValue({
            wishlist: [{ productId: 1 }],
            clearAll: vi.fn(),
        });

        vi.mocked(useProducts).mockReturnValue({
            products: [{ id: 1 }],
            loading: false,
        });

        render(<ProfileWishlist />);

        fireEvent.click(screen.getByText("Clear all"));

        expect(screen.getByTestId("confirm-dialog")).toBeInTheDocument();
    });

    test("confirming delete calls clearAll", async () => {
        const clearAllMock = vi.fn();

        vi.mocked(useWishlist).mockReturnValue({
            wishlist: [{ productId: 1 }],
            clearAll: clearAllMock,
        });

        vi.mocked(useProducts).mockReturnValue({
            products: [{ id: 1 }],
            loading: false,
        });

        render(<ProfileWishlist />);

        fireEvent.click(screen.getByText("Clear all"));

        await act(async () => {
            fireEvent.click(screen.getByText("confirm-delete"));
        });

        expect(clearAllMock).toHaveBeenCalledTimes(1);
    });

    test("cancel closes dialog", () => {
        vi.mocked(useWishlist).mockReturnValue({
            wishlist: [{ productId: 1 }],
            clearAll: vi.fn(),
        });

        vi.mocked(useProducts).mockReturnValue({
            products: [{ id: 1 }],
            loading: false,
        });

        render(<ProfileWishlist />);

        fireEvent.click(screen.getByText("Clear all"));
        fireEvent.click(screen.getByText("cancel-delete"));

        expect(screen.queryByTestId("confirm-dialog")).not.toBeInTheDocument();
    });
});
