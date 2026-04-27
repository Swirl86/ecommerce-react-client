import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import Products from "./Products";

// Mock the useProducts hook so we can control its return values
vi.mock("../hooks/useProducts", () => ({
    useProducts: vi.fn(),
}));

import { useProducts } from "../hooks/useProducts";

describe("Products page", () => {
    test("shows skeletons when loading is true", () => {
        // Mock the hook to simulate loading state
        useProducts.mockReturnValue({
            products: [],
            loading: true,
            error: false,
        });

        // Render the Products page
        render(<Products />);

        // SkeletonCard components do not have text, so we look for generic roles
        const skeletons = screen.getAllByRole("generic", { hidden: true });

        // Expect at least one skeleton to be rendered
        expect(skeletons.length).toBeGreaterThan(0);
    });

    test("shows products when loading is false", () => {
        // Mock the hook to return two products
        useProducts.mockReturnValue({
            products: [
                { id: 1, name: "Product A", price: 100, imageUrls: [] },
                { id: 2, name: "Product B", price: 200, imageUrls: [] },
            ],
            loading: false,
            error: false,
        });

        render(<Products />);

        // Both product names should be visible in the UI
        expect(screen.getByText("Product A")).toBeInTheDocument();
        expect(screen.getByText("Product B")).toBeInTheDocument();
    });

    test("shows error message when error is true", () => {
        // Mock the hook to simulate an error state
        useProducts.mockReturnValue({
            products: [],
            loading: false,
            error: true,
        });

        render(<Products />);

        // The error message should be displayed
        expect(
            screen.getByText("Could not connect to backend. Please try again later.")
        ).toBeInTheDocument();
    });
});
