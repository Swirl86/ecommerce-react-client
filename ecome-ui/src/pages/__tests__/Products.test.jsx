import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

// ----------------------
// Stable mocks
// ----------------------
const mockUseProducts = vi.fn();
const mockUseCategories = vi.fn(() => ({
    categories: [],
    loading: false,
    error: false,
}));

vi.mock("@hooks/domain/useProducts", () => ({
    useProducts: (args) => mockUseProducts(args),
}));

vi.mock("@hooks/domain/useCategories", () => ({
    useCategories: () => mockUseCategories(),
}));

// Mock UIContext (required by PageLayout)
vi.mock("@context/UIContext", () => ({
    __esModule: true,
    UIProvider: ({ children }) => <div>{children}</div>,
}));

// Mock ProductCard to avoid rendering full card
vi.mock("@products/ProductCard", () => ({
    default: ({ product }) => <div>{product.name}</div>,
}));

// Mock ProductFilters to avoid sidebar complexity
vi.mock("@sidebar/ProductFilters", () => ({
    default: ({ onSelectCategory }) => (
        <button onClick={() => onSelectCategory(5)}>Select Category</button>
    ),
}));

import Products from "../Products";

// ----------------------
// TESTS
// ----------------------
describe("Products page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("shows skeletons when loading is true", () => {
        mockUseProducts.mockReturnValue({
            products: [],
            loading: true,
            error: false,
        });

        render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );

        // SkeletonCard uses role="generic"
        expect(screen.getAllByRole("generic").length).toBeGreaterThan(0);
    });

    test("shows products when loading is false", () => {
        mockUseProducts.mockReturnValue({
            products: [
                { id: 1, name: "Product A", price: 100, imageUrls: [] },
                { id: 2, name: "Product B", price: 200, imageUrls: [] },
            ],
            loading: false,
            error: false,
        });

        render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );

        expect(screen.getByText("Product A")).toBeInTheDocument();
        expect(screen.getByText("Product B")).toBeInTheDocument();
    });

    test("updates category when ProductFilters triggers selection", () => {
        mockUseProducts.mockReturnValue({
            products: [],
            loading: false,
            error: false,
        });

        render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText("Select Category"));

        // After selecting category, useProducts should be called with categoryId = 5
        expect(mockUseProducts).toHaveBeenLastCalledWith({
            categoryId: 5,
            sort: "",
        });
    });

    test("updates sort when user selects a sort option", () => {
        mockUseProducts.mockReturnValue({
            products: [],
            loading: false,
            error: false,
        });

        render(
            <MemoryRouter>
                <Products />
            </MemoryRouter>
        );

        fireEvent.change(screen.getByDisplayValue("Sort by price"), {
            target: { value: "price,asc" },
        });

        expect(mockUseProducts).toHaveBeenLastCalledWith({
            categoryId: null,
            sort: "price,asc",
        });
    });
});
